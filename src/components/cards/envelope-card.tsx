import * as React from 'react';
import { Subscribe } from 'unstated';
import { Connector, DisplayComponent } from '../../atoms';
import { Knob } from '../../atoms/knob';
import { SelectionProvider } from '../../providers/selection.provider';
import { CardComponentProps } from './oscillator-card';

export class EnvelopeCard extends React.Component<CardComponentProps, any>{
    private width = 300;
    private height = 225;

    private selectionProvider: SelectionProvider = null;

    constructor(props) {
        super(props);

        this.state = {
            attack: 0.005,
            decay: 0.05,
            sustain: 0.6,
            release: 0.05,
            displayValues: [],
        }
    }

    componentDidMount() { this.createDisplay() }

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
                                style={{ width: this.width, height: this.height }} id="card-body">
                                <div className="card-header unselectable" onClick={this.props.onCardClick} id="card-header">
                                    <p id="card-header-p">Envelope</p>
                                </div>
                                <div className="card-display"><DisplayComponent data={this.state.displayValues} id={this.props.id} /></div>
                                <div className="knob-pannel">
                                    <Knob
                                        min={1}
                                        max={20000}
                                        value={this.state.attack * 1000}
                                        onChange={v => this.handleParamChange('attack', v)}
                                        label='Attack'
                                        logarithmic
                                    />
                                    <Knob
                                        min={1}
                                        max={20000}
                                        value={this.state.decay * 1000}
                                        onChange={v => this.handleParamChange('decay', v)}
                                        label="Decay"
                                        logarithmic
                                    />
                                    <Knob
                                        min={1}
                                        max={1000}
                                        value={this.state.sustain * 1000}
                                        onChange={v => this.handleParamChange('sustain', v)}
                                        label='Sustain'
                                    />
                                    <Knob
                                        min={1}
                                        max={20000}
                                        value={this.state.release * 1000}
                                        onChange={(v) => this.handleParamChange('release', v)}
                                        label="Release"
                                        logarithmic
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }}
            </Subscribe>
        );
    }

    createDisplay = () => {
        const { attack, sustain, decay, release } = this.state;
        if (!(attack && sustain && decay && release)) return;

        let displayValues = [];
        displayValues.push({ x: 0, y: 0 });
        displayValues.push({ x: attack, y: 1 });
        displayValues.push({ x: attack + decay, y: sustain });
        displayValues.push({ x: attack + 4 * decay, y: sustain });

        const alpha = (-1 / release) * Math.log(0.001 / sustain);
        const step = release / 20;
        for (let i = 1; i < 20; i++) {
            const y = sustain * Math.exp(-alpha * i * step)
            displayValues.push({ x: i * step + attack + 4 * decay, y });
        }
        this.setState({ displayValues });
    }

    handleParamChange = (name: string, value: number) => {
        this.props.onParamChange(name, value);
        this.setState({ [name]: value / 1000 });
        this.createDisplay();
    }
}

export enum envelopeParams {
    input = 'InSignal',
    output = 'OutSignal'
}