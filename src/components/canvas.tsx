import * as React from 'react';
import { Card, ConnectorMeta } from '../atoms';
import { ComponentMenu } from './component-menu';


export interface CanvasProps {
    onConnectorDrag: (metadata: any) => void;
    onConnectorDetected: (metadata: any) => void;
    onConnectorLost: (e: any) => void;
    currentConnection: { Inp: any, Outp: any };
}

export interface CardNode {
    x: number;
    y: number;
    id: string;
    connectors: ConnectorMeta[];
}

export interface CanvasState {
    nodes: CardNode[];
}

export class Canvas extends React.Component<CanvasProps, CanvasState> {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
        };
    }

    render() {
        const Outp = this.props.currentConnection.Outp;
        const Inp = this.props.currentConnection.Inp;
        return (
            <div className="App" onDragOver={(e) => this.handleDragOver(e)} onDrop={e => this.handleDrop(e)}>
                {this.state.nodes.map((n: CardNode) => {
                    return (<Card
                        Position={{ x: n.x, y: n.y }}
                        connectors={n.connectors}
                        connect={Outp && Inp && (n.id === Outp.parentId ? { Outp, Inp } : null)}
                        nodes={this.state.nodes}
                        handleDragStart={this.handleCardDrag}
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

    handleCardDrag = (e, id) => {
        e.dataTransfer.setData("id", id);
        e.dataTransfer.setData("movement-type", "move")
        e.dataTransfer.setData("drag-point", JSON.stringify({ x: e.clientX, y: e.clientY }));
    }

    handleCardDrop = e => {
        const id = e.dataTransfer.getData("id");
        const nodes = this.state.nodes.slice(0);
        const result = nodes.find((n: CardNode) => n.id === id);
        const startPoint = JSON.parse(e.dataTransfer.getData("drag-point"));

        const deltaX = e.pageX - startPoint.x;
        const deltaY = e.pageY - startPoint.y;

        result.x += deltaX;
        result.y += deltaY;

        this.setState({ nodes });
    }

    handleDragStart = (e, type) => {
        e.dataTransfer.setData("type", type)
    }

    handleDrop = e => {
        const movement_type = e.dataTransfer.getData("movement-type");
        if (movement_type === "move") {
            this.handleCardDrop(e);
        } else {
            const type = e.dataTransfer.getData('type');
            switch (type) {
                default:
                    this.createSRCNode(e.pageX, e.pageY, e.type);
                    break;
            }
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
