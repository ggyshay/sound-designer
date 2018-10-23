import * as React from 'react';
import { Subscribe } from 'unstated';
import { Card, ConnectorMeta } from '../atoms';
import { AudioEngine } from '../atoms/audio-engine';
import { InputDisplayComponent } from '../atoms/input-display';
import { CardNodeProvider } from '../providers/card-node.provider';
import { ConnectionProvider } from '../providers/connection.provider';
import { ComponentMenu } from './component-menu';
import { EngineComponent } from './engine-component';

export interface CanvasProps {
    onConnectorDrag: (metadata: any) => void;
    onConnectorDetected: (metadata: any) => void;
    onConnectorLost: (e: any) => void;
    currentConnection: { Inp: any, Outp: any };
}

export interface CardNode {
    x: number;
    y: number;
    id?: string;
    type: string;
    connectors: ConnectorMeta[];
    engine: AudioEngine;
    engRef?: React.RefObject<EngineComponent>;
}

export interface CanvasState {
    draggingId: string | null;
    draggingPoint: { x: number, y: number } | null;
}

export class Canvas extends React.Component<CanvasProps, CanvasState> {
    private ctx: AudioContext;
    private nodeProvider: CardNodeProvider;
    private connectionProvider: ConnectionProvider;

    constructor(props) {
        super(props);
        this.ctx = new AudioContext;
        this.state = {
            draggingId: null,
            draggingPoint: null
        };
    }

    componentDidUpdate() { this.updateConnectors() }

    render() {
        const Outp = this.props.currentConnection.Outp;
        const Inp = this.props.currentConnection.Inp;
        return (
            <Subscribe to={[CardNodeProvider, ConnectionProvider]}>
                {(nodeProvider: CardNodeProvider, connectionProvider: ConnectionProvider) => {
                    this.nodeProvider = nodeProvider
                    this.connectionProvider = connectionProvider;
                    return (
                        <div id="canvas" className="App" onDragOver={(e) => this.handleDragOver(e)} onDrop={e => this.handleDrop(e)}
                            onMouseUp={this.handleMouseUp}>
                            {this.nodeProvider.state.nodes.map((n: CardNode) => {
                                return (<EngineComponent
                                    key={n.id}
                                    connect={Outp && Inp && (n.id === Outp.parentId ? { Outp, Inp } : null)}
                                    type={n.type}
                                    ctx={this.ctx}
                                    connectorsCreateCB={this.handleCreateEngine}
                                    nodeId={n.id}
                                    ref={n.engRef}
                                >
                                    <Card
                                        Position={{ x: n.x, y: n.y }}
                                        type={n.type}
                                        handleCardDrag={this.handleCardDrag}
                                        onConnectorDrag={this.props.onConnectorDrag}
                                        onConnectorDetected={this.props.onConnectorDetected}
                                        onConnectorLost={this.props.onConnectorLost}
                                        key={n.id}
                                        id={n.id}
                                    />
                                </EngineComponent>
                                );
                            })}
                            <button onClick={() => this.nodeProvider.renewConnections()}>Trigger</button>
                            <ComponentMenu handleDrag={this.handleDragStart} />
                        </div>
                    )
                }}
            </Subscribe>
        );
    }

    handleCardDrag = (e: MouseEvent, id: string) => {
        document.addEventListener('mousemove', this.onMouseMove);
        this.setState({ draggingId: id, draggingPoint: { x: e.pageX, y: e.pageY } });
    }

    onMouseMove = (e: MouseEvent) => {
        const nodes = this.nodeProvider.state.nodes.slice(0)
        const node = this.nodeProvider.getNodeWithId(this.state.draggingId);
        const deltaX = e.pageX - this.state.draggingPoint.x;
        const deltaY = e.pageY - this.state.draggingPoint.y;
        node.x += deltaX;
        node.y += deltaY;
        node.connectors.forEach(cn => {
            cn.Position.x += deltaX;
            cn.Position.y += deltaY;
        });
        this.nodeProvider.updateNodes(nodes);
        this.setState({ draggingPoint: { x: e.pageX, y: e.pageY } });
    }

    handleMouseUp = () => {
        document.removeEventListener('mousemove', this.onMouseMove);
        this.setState({ draggingPoint: null, draggingId: null });
    }

    handleDragStart = (e, type) => {
        e.dataTransfer.setData("nodeType", type)
    }

    handleDrop = (e: any) => {
        const type = e.dataTransfer.getData('nodeType');
        const node = {
            x: e.pageX, y: e.pageY, type,
            connectors: [],
            engine: null,
            engRef: React.createRef<EngineComponent>()
        };
        this.nodeProvider.pushNode(node);
    }

    handleDragOver = e => { e.preventDefault(); }

    handleCreateEngine = (connectors: ConnectorMeta[], id: string, engine: AudioEngine) => {
        const nodes = this.nodeProvider.state.nodes.slice(0);
        const node = this.nodeProvider.getNodeWithId(id);
        node.engine = engine;
        node.connectors = connectors.slice(0);
        this.nodeProvider.updateNodes(nodes);
    }

    updateConnectors = () => {
        if (this.connectionProvider.state.isValid) {
            const inputConnector = this.connectionProvider.getInput();
            const outputConnector = this.connectionProvider.getOutput();
            const connections = outputConnector.connections.slice(0);
            connections.push({ id: inputConnector.id, parentId: inputConnector.parentId });
            const node = this.nodeProvider.getNodeWithId(outputConnector.parentId);
            const connectorIndex = node.connectors.findIndex((c) => c.id === outputConnector.id)
            node.connectors[connectorIndex].connections = connections;
            this.connectionProvider.cleanConnection();
            this.nodeProvider.updateNode(node, node.id);
            this.nodeProvider.renewConnections();
        }
    }
}