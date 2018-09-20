import * as React from 'react';
import { Card, ConnectorMeta } from '../atoms';
import { ComponentMenu } from './component-menu';


export interface CanvasProps {
    onConnectorDrag: (metadata: any) => void;
    onConnectorDetected: (metadata: any) => void;
    onConnectorLost: (e: any) => void;
    currentConnection: { Inp: any, Outp: any };
    connectionCallback: () => void;
}

export interface CardNode {
    x: number;
    y: number;
    id: string;
    connectors: ConnectorMeta[];
}

export interface CanvasState {
    nodes: CardNode[];
    draggingId: string | null;
    draggingPoint: { x: number, y: number } | null;
}

export class Canvas extends React.Component<CanvasProps, CanvasState> {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            draggingId: null,
            draggingPoint: null
        };
    }

    render() {
        const Outp = this.props.currentConnection.Outp;
        const Inp = this.props.currentConnection.Inp;
        return (
            <div className="App" onDragOver={(e) => this.handleDragOver(e)} onDrop={e => this.handleDrop(e)}
                onMouseUp={this.handleMouseUp}>
                {this.state.nodes.map((n: CardNode) => {
                    return (<Card
                        Position={{ x: n.x, y: n.y }}
                        connectors={n.connectors}
                        connect={Outp && Inp && (n.id === Outp.parentId ? { Outp, Inp } : null)}
                        connectionCallback={this.props.connectionCallback}
                        nodes={this.state.nodes}
                        handleCardDrag={this.handleCardDrag}
                        onConnectorDrag={this.props.onConnectorDrag}
                        onConnectorDetected={this.props.onConnectorDetected}
                        onConnectorLost={this.props.onConnectorLost}
                        key={n.id}
                        id={n.id}
                    />);
                })}

                <ComponentMenu handleDrag={this.handleDragStart} />
            </div>
        );
    }

    handleCardDrag = (e: MouseEvent, id: string) => {
        document.addEventListener('mousemove', this.onMouseMove);
        this.setState({ draggingId: id, draggingPoint: { x: e.pageX, y: e.pageY } });
    }

    onMouseMove = (e: MouseEvent) => {
        const nodes = this.state.nodes.slice(0)
        const node = this.getNodeWithId(this.state.draggingId, nodes)
        const deltaX = e.pageX - this.state.draggingPoint.x;
        const deltaY = e.pageY - this.state.draggingPoint.y;
        node.x += deltaX;
        node.y += deltaY;
        node.connectors.forEach(cn => {
            cn.Position.x += deltaX;
            cn.Position.y += deltaY;
        });
        this.setState({ nodes, draggingPoint: { x: e.pageX, y: e.pageY } });
    }

    handleMouseUp = () => {
        document.removeEventListener('mousemove', this.onMouseMove);
        this.setState({ draggingPoint: null, draggingId: null });
    }

    getNodeWithId = (id, nodes): CardNode => {
        return nodes.find((n: CardNode) => n.id === id)
    }

    handleDragStart = (e, type) => {
        e.dataTransfer.setData("type", type)
    }

    handleDrop = e => {
        const type = e.dataTransfer.getData('type');
        switch (type) {
            default:
                this.createSRCNode(e.pageX, e.pageY, e.type);
                break;
        }
    }

    handleDragOver = e => { e.preventDefault(); }

    createSRCNode = (x, y, type) => {
        const h = 50;
        const nodes = this.state.nodes.slice(0);
        const id = type + nodes.length;
        const node: CardNode = {
            x, y, id,
            connectors: [{ Position: { x: 185 + x, y: h + y }, isOutp: true, id: 'c0', parentX: x, parentY: y, parentId: id, connections: [] },
            { Position: { x: x - 9, y: y + h }, isOutp: false, id: 'c1', parentX: x, parentY: y, parentId: id, connections: [] }]
        }
        nodes.push(node);
        this.setState({ nodes })
    }
}
