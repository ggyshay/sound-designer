import * as React from 'react';
import { NumberInput } from 'src/atoms/number-input';
import pianoIC from '../../assets/icons/piano-icon.svg';
import { Connector } from '../../atoms';
import './cards.css';
import { CardComponentProps } from './oscillator-card';

export class InputCard extends React.Component<CardComponentProps>{

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
                <div className="input-card unselectable" onMouseDown={this.props.handleCardDrag} id="card-body">
                    <img src={pianoIC} className="ignore-mouse" id="card-header" />
                    <NumberInput onChange={(v) => this.props.onParamChange('semitoneShift', v)} />
                </div>
            </div>
        );
    }
}

export enum InputCardParams {
    output = 'OutSignal'
}