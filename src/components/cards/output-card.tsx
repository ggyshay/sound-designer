import * as React from 'react';
import speakerIcon from '../../assets/icons/speaker-icon.svg';
import { Connector } from '../../atoms';
import './cards.css';
import { CardComponentProps } from './oscillator-card';

export class OutputCard extends React.Component<CardComponentProps, any>{
    constructor(props) {
        super(props);

        this.state = {
            recording: false,
        }
    }

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
                <div className="output-card unselectable" onMouseDown={this.props.handleCardDrag} id="card-body" onClick={this.handleClick}>
                    <img src={speakerIcon} className="ignore-mouse" id="card-header" />
                </div>
            </div>
        );
    }

    handleClick = () => {
        console.log('rolou um clisc aqui');
        this.props.onParamChange('recording', !this.state.recording?'recording':'stoped');
        this.setState({ recording: !this.state.recording });
    }
}

export enum OutputCardParams {
    input = 'InSignal'
}