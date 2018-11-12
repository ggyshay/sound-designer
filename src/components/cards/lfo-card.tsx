import * as React from 'react';
import { Subscribe } from 'unstated';
import loopIC from '../../assets/icons/loop-icon.svg';
import oneShotIC from '../../assets/icons/oneshot-icon.svg';
import { Connector, InputDisplayComponent, Colors } from '../../atoms';
import { SelectionProvider } from '../../providers/selection.provider';
import { CardComponentProps } from './oscillator-card';
import { CardHeader } from 'src/atoms/card-header';

export interface LFOCardState {
    modeIsLoop: boolean,
    frequency: number | string,
    isMinimized: boolean;
}

export class LFOCard extends React.Component<CardComponentProps, LFOCardState>{
    private selectionProvider: SelectionProvider = null;

    constructor(props) {
        super(props);

        this.state = {
            modeIsLoop: true,
            frequency: 1,
            isMinimized: false,
        }
    }

    render() {
        return (
            <Subscribe to={[SelectionProvider]}>{
                (sp: SelectionProvider) => {
                    this.selectionProvider = sp;
                    const classname = 'card' + (this.selectionProvider.isSelected(this.props.id) ? ' selected' : '')
                    return this.state.isMinimized ? (
                        <div style={{ width: this.props.width, height: this.props.height }}>
                            <CardHeader label='LFO' onMinimizeToggle={this.handleMinimizeToggle}
                                onCardClick={this.props.onCardClick} isMinimized={this.state.isMinimized} />

                        </div>
                    ) : (
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
                                    style={{ width: this.props.width, height: this.props.height }} id="card-body">
                                    <CardHeader label='LFO' onMinimizeToggle={this.handleMinimizeToggle}
                                        onCardClick={this.props.onCardClick} isMinimized={this.state.isMinimized} />
                                    <div className="card-display"><InputDisplayComponent id={this.props.id} onChange={this.handleWaveChange} /></div>
                                    <div className="lfo-control-pannel">
                                        <input className="lfo-frequency-input" onChange={e => this.handleFrequencyChange(e.target.value)}
                                            value={this.state.frequency + ' Hz'} onFocus={() => this.selectionProvider.cleanSelection()} />
                                        <div className="lfo-mode-button">
                                            <div style={{ backgroundColor: (!this.state.modeIsLoop ? Colors.secondary : '') }} onClick={e => this.handleModeChange(false)}>
                                                <img src={oneShotIC} className="unselectable" />
                                            </div>
                                            <div style={{ backgroundColor: (this.state.modeIsLoop ? Colors.secondary : '') }} onClick={e => this.handleModeChange(true)}>
                                                <img src={loopIC} className="unselectable" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )
                }}
            </Subscribe>
        );
    }

    handleMinimizeToggle = () => {
        this.setState({ isMinimized: !this.state.isMinimized });
    }

    handleFrequencyChange = (frequencyText: string) => {
        const frequency = frequencyText.replace(/[^(0-9.)]/gm, '');
        this.props.onParamChange('frequency', +frequency);
        this.setState({ frequency })
    }

    handleModeChange = modeIsLoop => {
        this.setState({ modeIsLoop })
    }

    handleWaveChange = (wave: Float32Array) => {
        this.props.onParamChange('waveform', wave);
    }
}
