import * as React from 'react';
import { Subscribe } from 'unstated';
import { Connector, ConnectorMeta } from '../../atoms';
import { OscillatorTypes } from '../../atoms/audio-engine';
import { CardNodeProvider } from '../../providers/card-node.provider';
import { ConnectionProvider } from '../../providers/connection.provider';
import './cards.css';


export interface CardComponentProps {
    onParamChange: (param: string, value: string | number) => void;
    handleCardDrag: (e: any) => void;
    connectors?: { inputs: string[], outputs: string[] };
    Position: { x: number, y: number };
    id: string;
    onConnectorDrag: (metadata: any) => void;
    onConnectorDetected: (metadata: any) => void;
    onConnectorLost: (e: any) => void;
    connect?: { Outp: ConnectorMeta, Inp: ConnectorMeta };
}

export class OscillatorCard extends React.Component<CardComponentProps, any>{
    private cardNodeProvider: CardNodeProvider = null;
    private connectionProvider: ConnectionProvider = null;

    constructor(props) {
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
        const node = this.cardNodeProvider.getNodeWithId(this.props.id);
        node.connectors = connectors;
        this.cardNodeProvider.updateNode(node, this.props.id);
        this.setState({ connectors });
    }

    render() {
        return (
            <Subscribe to={[CardNodeProvider, ConnectionProvider]} >
                {(nodeProvider: CardNodeProvider, connectionProvider: ConnectionProvider) => {
                    this.cardNodeProvider = nodeProvider;
                    this.connectionProvider = connectionProvider;

                    return (
                        <div>
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
                                        type={cn.type}
                                    />
                                )
                            })}
                            <div className="card" onMouseDown={this.props.handleCardDrag}>
                                <div className="card-header unselectable">
                                    <p>Oscillator</p>
                                </div>
                                <div className="card-display"></div>
                                <select className="source-selector" onChange={(e) => this.props.onParamChange('type', e.target.value)}>
                                    <option value={OscillatorTypes.sine}> Sine </option>
                                    <option value={OscillatorTypes.square}> Square </option>
                                    <option value={OscillatorTypes.saw}> Saw </option>
                                    <option value={OscillatorTypes.triangle}> Triangle </option>
                                </select>
                            </div>
                        </div>);
                }}
            </Subscribe>
        )
    }

    updateConnectors = () => {
        if (this.connectionProvider.state.isValid) {
            const inputConnector = this.connectionProvider.getInput();
            const outputConnector = this.connectionProvider.getOutput();
            const connections = outputConnector.connections.slice(0);
            connections.push({ id: inputConnector.id, parentId: inputConnector.parentId });
            const node = this.cardNodeProvider.getNodeWithId(outputConnector.parentId);
            const connectorIndex = node.connectors.findIndex((c) => c.id === outputConnector.id)
            node.connectors[connectorIndex].connections = connections;
            this.connectionProvider.cleanConnection();
            this.cardNodeProvider.updateNode(node, node.id);
            this.cardNodeProvider.renewConnections();
        }
    }
}
