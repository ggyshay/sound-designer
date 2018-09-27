import * as React from 'react';
import { CardComponentProps } from './oscillator-card';
import { Connector } from '../../atoms';
import { FilterTypes } from '../../atoms/audio-engine';
import { Knob } from "react-rotary-knob";
import skin from '../../atoms/knob-skin';

export class FilterCard extends React.Component<CardComponentProps, any>{
    private width = 300;
    private height = 500;

    constructor(props) {
        super(props);

        this.state = {
            frequency: null,
            Q: null,
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
                        <option value={FilterTypes.HPF}> High Pass </option>
                        <option value={FilterTypes.LPF}> Low Pass </option>
                        <option value={FilterTypes.BPF}> Band Pass </option>
                    </select>
                    <Knob
                        style={{ display: "inline-block" }}
                        min={20}
                        max={20000}
                        unlockDistance={0}
                        value={this.state.frequency}
                        onChange={this.handleFrequencyChange}
                        skin={skin}
                    />
                    <Knob
                        style={{ display: "inline-block" }}
                        min={20}
                        max={20000}
                        unlockDistance={0}
                        value={this.state.frequency}
                        onChange={this.handleQChange}
                        skin={skin}
                    />
                </div>
            </div>
        );
    }

    handleFrequencyChange = frequency => {
        this.props.onParamChange('frequency', frequency);
        this.setState({ frequency });
    }

    handleQChange = Q => {
        this.props.onParamChange('Q', Q);
        this.setState({ Q });
    }
}