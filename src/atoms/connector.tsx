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
        const { dx, dy } = this.getSVGSize();
        return (
            <div>
                <div className="connector"
                    style={{ left: this.props.Position.x, top: this.props.Position.y }}
                    onMouseDown={e => this.handleConnectorDrag(e)}
                    onMouseOver={e => this.handleConnectorDetected(e)}
                    onMouseLeave={this.props.onConnectorLost}
                ></div>
                <svg style={{ position: 'fixed' }} width={dx} height={dy}>
                    {this.props.connections.map(cn => <Bezier P1={this.props.Position} P2={cn.Position} />)}
                </svg>
            </div>
        );
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
                x: this.props.Position.x + this.props.parentX + 7,
                y: this.props.Position.y + this.props.parentY + 7,
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
        return { dx: maxX - minX, dy: maxY - minY }
    }
}