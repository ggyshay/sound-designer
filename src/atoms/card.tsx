import * as React from 'react';
import './card.css';
import { Connector } from './';
import { CardNode } from '../components'
import _ from 'lodash';

export interface CardProps {
    Position: { x: number, y: number }
    id: string;
    onConnectorDrag: (metadata: any) => void;
    onConnectorDetected: (metadata: any) => void;
    onConnectorLost: (e: any) => void;
    connectors: ConnectorMeta[];
    connect: { Outp: ConnectorMeta, Inp: ConnectorMeta};
    nodes: CardNode[];
    handleCardDrag: (e: any, id: string) => void;
    connectionCallback: () => void;
}

export type ConnectorMeta = {
    Position: { x: number, y: number }
    id: string;
    isOutp: boolean;
    connections: ConnectorMeta[];
    parentId: string;
    parentX: number,
    parentY: number,
}

export interface CardState {
    connectors: ConnectorMeta[];
}

export class Card extends React.Component<CardProps, CardState> {
    constructor(props) {
        super(props);
        this.state = {
            connectors: props.connectors.slice(0),
        }
    }

    componentDidUpdate() {

        this.updateConnectors();
        return true
    }

    public render() {
        return (
            <div className="card-holder"
                style={{ left: this.props.Position.x, top: this.props.Position.y }}

            >
                {this.state.connectors.map(cn => {
                    return (
                        <Connector
                            parentX={this.props.Position.x}
                            parentY={this.props.Position.y}
                            Position={cn.Position}
                            id={cn.id}
                            parentId={this.props.id}
                            isOutp={cn.isOutp}
                            onConnectorDetected={this.props.onConnectorDetected}
                            onConnectorDrag={this.props.onConnectorDrag}
                            onConnectorLost={this.props.onConnectorLost}
                            connections={cn.connections}
                            key={cn.id}
                            nodes={this.props.nodes}
                        />
                    )
                })}

                <div className="card" onMouseDown={e => this.handleCardDrag(e)}>
                    <div className="card-header">
                        <p>Source</p>
                    </div>
                    <div className="card-display"></div>
                    <select className="source-selector">
                        <option> Sine </option>
                        <option> Square </option>
                        <option> Saw </option>
                        <option> Triangle </option>
                    </select>
                </div>
            </div>
        )
    }

    handleCardDrag = e => {
        this.props.handleCardDrag(e, this.props.id);
    }

    updateConnectors = () => {
        // update each connector, recalculating its connections' x and y with the nodes props
        const connectors = this.state.connectors.slice(0);
        const newConnectors = connectors.map(cn => {
            const newConnections = cn.connections.map(connection => {
                return this.recalculateConnection(connection.parentId, connection.id, this.props.nodes);
            });
            cn.connections = newConnections;
            return cn
        });


        if (this.props.connect) {
            const outCon = newConnectors.find((cn: ConnectorMeta) => cn.id === this.props.connect.Outp.id);
            const inNode = this.props.nodes.find((n: CardNode) => n.id === this.props.connect.Inp.parentId);
            if (!inNode) return;
            const inCon = inNode.connectors.find((cn: ConnectorMeta) => cn.id === this.props.connect.Inp.id);

            if (!this.areConnected(inCon, outCon)) {
                outCon.connections.push(inCon);
                this.props.connectionCallback();
            }
        }
        if (!_.isEqual(this.state.connectors, newConnectors)) {
            this.setState({ connectors: newConnectors });
        }
    }

    recalculateConnection = (nid: string, cid: string, nodes: CardNode[]) => {
        const node = nodes.find((n: CardNode) => n.id === nid);
        return node.connectors.find((cn) => cn.id == cid);
    }

    areConnected = (inCon: ConnectorMeta, outCon: ConnectorMeta) => {
        return !!outCon.connections.find((cn: ConnectorMeta) => cn.id === inCon.id);
    }
}
