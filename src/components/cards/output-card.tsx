import * as React from 'react';
import { Subscribe } from 'unstated';
import { CardNodeProvider } from '../../providers/card-node.provider';
import { ConnectionProvider } from '../../providers/connection.provider';
import speakerIcon from '../../assets/icons/speaker-icon.svg';
import './cards.css';
import { CardComponentProps } from './oscillator-card';
import './cards.css';
import { Connector } from '../../atoms';

export class OutputCard extends React.Component<CardComponentProps>{

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
                            type={cn.type}
                        />
                    )
                })}
                <div className="output-card unselectable" onMouseDown={this.props.handleCardDrag}>
                    <img src={speakerIcon} className="ignore-mouse" />
                </div>
            </div>
        );
    }
}

export enum OutputCardParams {
    input = 'InSignal'
}