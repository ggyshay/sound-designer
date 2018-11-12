import * as React from 'react';
import { Subscribe } from 'unstated';
import { Connector, ConnectorMeta, DisplayComponent } from '../../atoms';
import { OscillatorTypes } from '../../atoms/audio-engine';
import { SelectionProvider } from '../../providers/selection.provider';
import './cards.css';
import { Waveforms } from '../../atoms/waveforms';
import { CardHeader } from 'src/atoms/card-header';

export interface CardComponentProps {
    onParamChange: (param: string, value: string | number | Float32Array) => void;
    handleCardDrag: (e: any) => void;
    connectors?: ConnectorMeta[];
    Position: { x: number, y: number };
    id: string;
    onConnectorDrag: (metadata: any) => void;
    onConnectorDetected: (metadata: any) => void;
    onConnectorLost: (e: any) => void;
    connect?: { Outp: ConnectorMeta, Inp: ConnectorMeta };
    onCardClick: (e: any) => void;
    getFrequencyResponse?: (inputFrequencies: Float32Array) => Float32Array;
    width: number;
    height: number;
}

export class OscillatorCard extends React.Component<CardComponentProps, any>{
    private selectionProvider: SelectionProvider = null;
    constructor(props) {
        super(props);
        this.state = {
            type: 'sine',
            isMinimized: false,
        }
    }

    render() {
        return (
            <Subscribe to={[SelectionProvider]} >
                {(selectionProvider: SelectionProvider) => {
                    this.selectionProvider = selectionProvider;
                    const classname = 'card' + (this.selectionProvider.isSelected(this.props.id) ? ' selected' : '')
                    return this.state.isMinimized ? (
                        <div style={{ width: this.props.width, height: this.props.height }}>
                            <CardHeader label='Oscillator' onMinimizeToggle={this.handleMinimizeToggle}
                                onCardClick={this.props.onCardClick} isMinimized={this.state.isMinimized} />

                        </div>
                    ) : (
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
                                <div className={classname} onMouseDown={this.props.handleCardDrag} id="card-body">
                                    <CardHeader label='Oscillator' onMinimizeToggle={this.handleMinimizeToggle}
                                onCardClick={this.props.onCardClick} isMinimized={this.state.isMinimized} />
                                    <div className="card-display"><DisplayComponent data={Waveforms[this.state.type]} id={this.props.id} /></div>
                                    <select className="source-selector" onChange={this.handleTypeChange}>
                                        <option value={OscillatorTypes.sine}> Sine </option>
                                        <option value={OscillatorTypes.square}> Square </option>
                                        <option value={OscillatorTypes.saw}> Saw </option>
                                        <option value={OscillatorTypes.triangle}> Triangle </option>
                                    </select>
                                </div>
                            </div>);
                }}
            </Subscribe>
        )
    }

    handleMinimizeToggle = () => {
        this.setState({isMinimized: !this.state.isMinimized})
    }

    handleTypeChange = e => {
        this.setState({ type: e.target.value });
        this.props.onParamChange('type', e.target.value)
    }
}

export enum OscillatorParams {
    frequency = 'frequency',
    output = 'OutSignal',
}
