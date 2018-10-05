import * as React from 'react';
import { Subscribe } from 'unstated';
import { CardNodeProvider } from '../../providers/card-node.provider';
import { ConnectionProvider } from '../../providers/connection.provider';
import speakerIcon from '../../assets/icons/speaker-icon.svg';
import './cards.css';
import { CardComponentProps } from './oscillator-card';
import './cards.css';
import { Connector } from '../../atoms';

export class OutputCard extends React.Component<CardComponentProps, any>{
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
        inputs.map((inp) => {
            connectors.push({
                Position: { x: x - 7, y: y + 34 }, isOutp: false,
                id: id + inp, parentX: x, parentY: y, parentId: id, connections: [], type: inp
            })
        })
        const node = this.cardNodeProvider.getNodeWithId(this.props.id);
        node.connectors = connectors;
        this.cardNodeProvider.updateNode(node, this.props.id);
        this.setState({ connectors });
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
        }
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
                            <div className="output-card unselectable" onMouseDown={this.props.handleCardDrag}>
                                <img src={speakerIcon} className="ignore-mouse" />
                            </div>
                        </div>
                    );
                }}
            </Subscribe>
        )
    }
}