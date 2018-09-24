import * as React from 'react';
import './card.css';
import { Connector, CardComponent } from './';
import { CardNode } from '../components'
import _ from 'lodash';
import { OutputComponent } from './output';

export interface CardProps {
    Position: { x: number, y: number }
    id: string;
    type: string;
    connectors?: { inputs: string[], outputs: string[] };
    connect?: { Outp: ConnectorMeta, Inp: ConnectorMeta };
    nodes: CardNode[];
    onConnectorDrag: (metadata: any) => void;
    onConnectorDetected: (metadata: any) => void;
    onConnectorLost: (e: any) => void;
    handleCardDrag: (e: any, id: string) => void;
    connectionCallback: () => void;
    connectorsCreateCB?: (connectors: ConnectorMeta[], id: string) => void;
}

export type ConnectorMeta = {
    Position: { x: number, y: number }
    id: string;
    isOutp: boolean;
    connections: ConnectorMeta[];
    parentId: string;
    parentX: number,
    parentY: number,
    type: string,
}

export interface CardState {
    connectors: ConnectorMeta[];
}

export class Card extends React.Component<CardProps, CardState> {
    constructor(props: CardProps) {
        super(props);
        this.state = {
            connectors: [],
        }
    }

    componentDidMount() { this.setupConnectors(); }

    componentDidUpdate() { this.updateConnectors(); }

    setupConnectors = () => {
        const { Position: { x, y }, id, connectors: { inputs, outputs } } = this.props
        const connectors = []
        inputs.map((inp, idx) => {
            connectors.push({
                Position: { x: x - 7, y: y + 50 + idx * 30 }, isOutp: false,
                id: id + inp, parentX: x, parentY: y, parentId: id, connections: [], type: inp
            })
        })
        outputs.map((outp, idx) => {
            connectors.push({
                Position: { x: x + 185, y: y + 50 + idx * 30 }, isOutp: true,
                id: id + outp, parentX: x, parentY: y, parentId: id, connections: [], type: outp
            })
        })
        this.props.connectorsCreateCB(connectors, this.props.id);
        this.setState({ connectors });
    }

    public render() {
        return this.props.type === 'Output' ? (
            <OutputComponent
                Position={this.props.Position}
                connector={this.state.connectors && this.state.connectors[0]}
                id={this.props.type}
                onConnectorDetected={this.props.onConnectorDetected}
                onConnectorDrag={this.props.onConnectorDrag}
                onConnectorLost={this.props.onConnectorLost}
                handleCardDrag={this.props.handleCardDrag}
                type={this.props.type}
            />
        ) : (
                <div className="card-holder" style={{ left: this.props.Position.x, top: this.props.Position.y }}>
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
                                type={cn.type}
                            />
                        )
                    })}

                    <CardComponent type={this.props.type} handleCardDrag={this.handleCardDrag} />
                </div>
            )
    }

    handleCardDrag = e => {
        this.props.handleCardDrag(e, this.props.id);
    }

    updateConnectors = () => {
        const connectors = this.state.connectors.slice(0);
        const newConnectors = connectors.map(cn => {
            const newConnections = cn.connections.map(connection => {
                return this.recalculateConnection(connection.parentId, connection.id, this.props.nodes);
            });
            cn.connections = newConnections;
            return cn;
        });

        if (this.props.connect) {
            const outCon = newConnectors.find((cn: ConnectorMeta) => cn.id === this.props.connect.Outp.id);
            if (!this.areConnected(this.props.connect.Inp, outCon)) {
                outCon.connections.push(this.props.connect.Inp);
                this.props.connectionCallback();
            }
        }
        if (!_.isEqual(this.state.connectors, newConnectors)) {
            this.setState({ connectors: newConnectors });
        }
    }

    recalculateConnection = (nid: string, cid: string, nodes: CardNode[]) => {
        console.log('recalc ',nid, cid, nodes )
        const node = nodes.find((n: CardNode) => n.id === nid);
        return node.connectors.find((cn) => cn.id == cid);
    }

    areConnected = (inCon: ConnectorMeta, outCon: ConnectorMeta) => {
        return !!outCon.connections.find((cn: ConnectorMeta) => (cn.id === inCon.id));
    }
}
