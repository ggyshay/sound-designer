import * as React from 'react';
import { Subscribe } from 'unstated';
import { Connector, DisplayComponent } from '../../atoms';
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
            frequency: 350,
            Q: 1,
            frequencyResponse: [],
        }
    }

    componentDidMount() { this.getFrequencyResponse() }

    render() {
        return (
            <Subscribe to={[SelectionProvider]}>{
                (sp: SelectionProvider) => {
                    this.selectionProvider = sp;
                    const classname = 'card' + (this.selectionProvider.isSelected(this.props.id) ? ' selected' : '')
                    return (
                        <div id="card-body">
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
                                style={{ width: this.width, height: this.height }} id="card-body">
                                <div className="card-header unselectable" onClick={this.props.onCardClick} id="card-header">
                                    <p id="card-header-p">Filter</p>
                                </div>
                                <div className="card-display"><DisplayComponent data={this.state.frequencyResponse} id={this.props.id} /></div>
                                <select className="source-selector" onChange={(e) => this.handleTypeChange(e.target.value)}>
                                    <option value={FilterTypes.LPF}> Low Pass </option>
                                    <option value={FilterTypes.HPF}> High Pass </option>
                                    <option value={FilterTypes.BPF}> Band Pass </option>
                                </select>
                                <div className="knob-pannel">
                                    <Knob
                                        min={20}
                                        max={20000}
                                        value={this.state.frequency}
                                        onChange={this.handleFrequencyChange}
                                        label={filterParams.frequency}
                                        logarithmic
                                    />
                                    <Knob
                                        min={0}
                                        max={5}
                                        value={this.state.Q}
                                        onChange={this.handleQChange}
                                        label={filterParams.Q}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }}
            </Subscribe>
        );
    }

    getFrequencyResponse = () => {
        if (!this.props.getFrequencyResponse) return;
        let inputFrequencies = new Float32Array(150);
        for (let i = 0; i < 150; i++) {
            inputFrequencies[i] = 20000 / 150 * i;
        }
        const frequencyResponse = [];
        this.props.getFrequencyResponse(inputFrequencies).forEach((y, i) => {
            frequencyResponse.push({ x: inputFrequencies[i], y })
        });
        this.setState({ frequencyResponse });
    }

    handleFrequencyChange = frequency => {
        this.props.onParamChange(filterParams.frequency, frequency);
        this.setState({ frequency });
        this.getFrequencyResponse();
    }

    handleQChange = Q => {
        this.props.onParamChange(filterParams.Q, Q);
        this.setState({ Q });
        this.getFrequencyResponse();
    }

    handleTypeChange = type => {
        this.props.onParamChange(filterParams.type, type);
        this.getFrequencyResponse();
    }
}

export enum filterParams {
    input = 'InSignal',
    output = 'OutSignal',
    frequency = 'frequency',
    Q = 'Q',
    type = 'type',
}
