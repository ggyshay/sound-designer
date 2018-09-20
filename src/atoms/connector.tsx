import * as React from 'react';
import './connector.css'
import { Bezier } from './';
import { CardNode } from '../components';
import { ConnectorMeta } from './card';

export interface ConnectorProps {
    Position: { x: number, y: number }
    isOutp: boolean;
    onConnectorLost: (e: any) => void;
    onConnectorDrag: (metadata: ConnectorMeta) => void;
    onConnectorDetected: (metadata: ConnectorMeta) => void;
    parentX: number;
    parentY: number; // TODO: change to ParentPosition
    parentId: string;
    id: string;
    connections: any;
    nodes: CardNode[];
}

export class Connector extends React.Component<ConnectorProps, any>{
    public metadata = null;
    render() {
        const { dx, dy, x0, y0 } = this.getSVGSize();
        return (
            <div>
                <div className="connector"
                    style={{ left: this.props.Position.x, top: this.props.Position.y}}
                    onMouseDown={e => this.handleConnectorDrag(e)}
                    onMouseOver={e => this.handleConnectorDetected(e)}
                    onMouseLeave={this.handleConnectorLost}
                ></div>
                {true &&
                    <svg style={{ position: 'fixed', left: x0, top: y0, pointerEvents: 'none', zIndex: -10 }}
                        width={dx} height={dy} viewBox={`0 0 ${dx} ${dy}`}>
                        {this.props.connections.map(cn => {
                            const bx0 = this.props.Position.x - x0 + 7, by0 = this.props.Position.y - y0 + 7,
                                bx1 = cn.Position.x - x0 + 7, by1 = cn.Position.y - y0 + 7;
                            return (
                                <Bezier P1={{ x: bx0, y: by0 }} P2={{ x: bx1, y: by1 }} />)
                        })}
                    </svg>
                }

            </div>
        );
    }

    handleConnectorLost = e => {
        this.props.onConnectorLost(e);
    }

    handleConnectorDrag = (e) => {
        this.props.onConnectorDrag(this.Metadata());
    }

    handleConnectorDetected = (e) => {
        this.props.onConnectorDetected(this.Metadata());
    }

    Metadata = (): ConnectorMeta => {
        return ({
            Position: {
                x: this.props.Position.x + 7,
                y: this.props.Position.y + 7
            },
            isOutp: this.props.isOutp,
            parentId: this.props.parentId,
            id: this.props.id,
            connections: this.props.connections.slice(0),
            parentX: this.props.parentX,
            parentY: this.props.parentY
        })
    }

    private getSVGSize = () => {
        let maxX = this.props.Position.x, maxY = this.props.Position.y,
            minX = this.props.Position.x, minY = this.props.Position.y;

        this.props.connections.forEach(cn => {
            maxX = cn.Position.x > maxX ? cn.Position.x : maxX;
            minX = cn.Position.x < minX ? cn.Position.x : minX;
            maxY = cn.Position.y > maxY ? cn.Position.y : maxY;
            minY = cn.Position.y < minY ? cn.Position.y : minY;
        });
        return { dx: maxX - minX + 32, dy: maxY - minY + 32, x0: minX, y0: minY }
    }
}