import * as React from 'react';
import './cards.css'
import { ConnectorMeta, Connector } from '../../atoms';
import { CardNode } from '../canvas';


export interface CardComponentProps {
    type: string;
    onParamChange: (param: string, value: string | number) => void;
    handleCardDrag: (e: any) => void;
    connectors: ConnectorMeta[];
    Position: {x:number, y: number};
    id: string;
    onConnectorDrag: (metadata: any) => void;
    onConnectorDetected: (metadata: any) => void;
    onConnectorLost: (e: any) => void;
    nodes: CardNode[];
}

export class OscillatorCard extends React.Component<CardComponentProps>{
    render() {
        return (
            <div>
                {this.props.connectors.map(cn => {
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
                <div className="card" onMouseDown={this.props.handleCardDrag}>
                    <div className="card-header">
                        <p>{this.props.type}</p>
                    </div>
                    <div className="card-display"></div>
                    <select className="source-selector" onChange={(e) => this.props.onParamChange('type', e.target.value)}>
                        <option value='sine'> Sine </option>
                        <option value='square'> Square </option>
                        <option value='sawtooth'> Saw </option>
                        <option value='triangle'> Triangle </option>
                    </select>
                </div>
            </div>
        )
    }
}
