import * as React from 'react';
import { Subscribe } from 'unstated';
import { CardNodeProvider } from '../providers/card-node.provider';
import { Bezier } from './';
import { ConnectorMeta } from './card';
import './connector.css';
import { SelectionProvider } from '../providers/selection.provider';

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
    connections?: { id: string, parentId: string }[];
    type: string;
}

export type ConnectionMeta = {
    id: string;
    parentId: string;
}

export class Connector extends React.Component<ConnectorProps, any>{
    public metadata = null;
    private cardNodeProvider: CardNodeProvider = null;
    private selectionProvider: SelectionProvider = null;

    constructor(props) {
        super(props);

        this.state = {
            selected: {}
        }
    }

    render() {
        const { dx, dy, x0, y0 } = this.getSVGSize();
        return (
            <Subscribe to={[CardNodeProvider, SelectionProvider]}>
                {(cardNodeProvider: CardNodeProvider, selectionProvider: SelectionProvider) => {
                    this.cardNodeProvider = cardNodeProvider;
                    this.selectionProvider = selectionProvider;
                    return (
                        <div>
                            <div className="connector"
                                style={{ left: this.props.Position.x, top: this.props.Position.y }}
                                onMouseDown={e => this.handleConnectorDrag(e)}
                                onMouseOver={e => this.handleConnectorDetected(e)}
                                onMouseLeave={this.handleConnectorLost}
                            ></div>
                            {this.props.connections &&
                                <svg style={{ position: 'fixed', left: x0, top: y0, pointerEvents: 'none', zIndex: -10 }}
                                    width={dx} height={dy} viewBox={`0 0 ${dx} ${dy}`}>
                                    {this.props.connections.map((connection: ConnectionMeta) => {
                                        const cn = this.getConnector(connection);
                                        if(!cn) return null;
                                        const bx0 = this.props.Position.x - x0 + 7, by0 = this.props.Position.y - y0 + 7,
                                            bx1 = cn.Position.x - x0 + 7, by1 = cn.Position.y - y0 + 7;
                                        return (
                                            <Bezier P1={{ x: bx0, y: by0 }} P2={{ x: bx1, y: by1 }}
                                                key={this.props.id + cn.id}
                                                selected={this.selectionProvider.isSelected(this.props.id, cn.id)}
                                                onClick={() => this.handleSelectCurve(cn)}
                                            />)
                                    })}
                                </svg>
                            }
                        </div>
                    );
                }}
            </Subscribe>
        );
    }


    handleSelectCurve = (cn: ConnectorMeta) => {
        this.selectionProvider.select(this.props.id, cn.id, this.props.parentId, cn.parentId)
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
            parentY: this.props.parentY,
            type: this.props.type
        });
    }

    getConnector = (connection: ConnectionMeta) => {
        const node = this.cardNodeProvider.getNodeWithId(connection.parentId);
        if(!node) return null;
        return node.connectors.find((c) => c.id === connection.id);
    }

    private getSVGSize = () => {
        let maxX = this.props.Position.x, maxY = this.props.Position.y,
            minX = this.props.Position.x, minY = this.props.Position.y;

        this.props.connections.forEach((connection: { id: string, parentId: string }) => {
            const cn = this.getConnector(connection);
            if(!cn) return null;
            maxX = cn.Position.x > maxX ? cn.Position.x : maxX;
            minX = cn.Position.x < minX ? cn.Position.x : minX;
            maxY = cn.Position.y > maxY ? cn.Position.y : maxY;
            minY = cn.Position.y < minY ? cn.Position.y : minY;
        });
        return { dx: maxX - minX + 32, dy: maxY - minY + 32, x0: minX, y0: minY }
    }
}