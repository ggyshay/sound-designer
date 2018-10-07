import * as React from 'react';
import { Subscribe } from 'unstated';
import { Connector } from '../../atoms';
import { FilterTypes } from '../../atoms/audio-engine';
import { Knob } from '../../atoms/knob';
import { SelectionProvider } from '../../providers/selection.provider';
import { CardComponentProps } from './oscillator-card';

export class FilterCard extends React.Component<CardComponentProps, any>{
    private width = 205;
    private height = 285;

    private selectionProvider: SelectionProvider = null;

    constructor(props) {
        super(props);

        this.state = {
            frequency: 20,
            Q: 1
        }
    }
    render() {
        return (
            <Subscribe to={[SelectionProvider]}>{
                (sp: SelectionProvider) => {
                    this.selectionProvider = sp;
                    const classname = 'card' + (this.selectionProvider.isSelected(this.props.id) ? ' selected' : '')
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
                            <div className={classname} onMouseDown={this.props.handleCardDrag}
                                style={{ width: this.width, height: this.height }}>
                                <div className="card-header unselectable" onClick={this.props.onCardClick}>
                                    <p>Filter</p>
                                </div>
                                <div className="card-display"></div>
                                <select className="source-selector" onChange={(e) => this.props.onParamChange('type', e.target.value)}>
                                    <option value={FilterTypes.LPF}> Low Pass </option>
                                    <option value={FilterTypes.HPF}> High Pass </option>
                                    <option value={FilterTypes.BPF}> Band Pass </option>
                                </select>
                                <div className="knob-pannel">
                                    <Knob
                                        style={{ display: "inline-block" }}
                                        min={20}
                                        max={20000}
                                        unlockDistance={0}
                                        value={this.state.frequency}
                                        onChange={this.handleFrequencyChange}
                                        label='Frequency'
                                    />
                                    <Knob
                                        style={{ display: "inline-block" }}
                                        min={0}
                                        max={5}
                                        unlockDistance={0}
                                        value={this.state.Q}
                                        onChange={this.handleQChange}
                                        label="Q"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }}
            </Subscribe>
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