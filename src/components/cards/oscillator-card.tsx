import * as React from 'react';
import { Subscribe } from 'unstated';
import { Connector, ConnectorMeta, DisplayComponent } from '../../atoms';
import { OscillatorTypes } from '../../atoms/audio-engine';
import { SelectionProvider } from '../../providers/selection.provider';
import './cards.css';
import { Waveforms } from '../../atoms/waveforms';

export interface CardComponentProps {
    onParamChange: (param: string, value: string | number) => void;
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
}

export class OscillatorCard extends React.Component<CardComponentProps, any>{
    private selectionProvider: SelectionProvider = null;
    constructor(props) {
        super(props);
        this.state = {
            type: 'sine',
        }
    }

    render() {
        return (
            <Subscribe to={[SelectionProvider]} >
                {(selectionProvider: SelectionProvider) => {
                    this.selectionProvider = selectionProvider;
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
                            <div className={classname} onMouseDown={this.props.handleCardDrag}>
                                <div className="card-header unselectable" onClick={this.props.onCardClick}>
                                    <p>Oscillator</p>
                                </div>
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

    handleTypeChange = e => {
        console.log('change ', this.state.type, e.target.value)
        this.setState({ type: e.target.value });
        this.props.onParamChange('type', e.target.value)
    }
}
