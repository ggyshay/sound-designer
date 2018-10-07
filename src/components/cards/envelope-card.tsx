import * as React from 'react';
import { Subscribe } from 'unstated';
import { Connector } from '../../atoms';
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
            attack: null,
            decay: null,
            sustain: null,
            release: null,
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
                                    <p>Envelope</p>
                                </div>
                                <div className="card-display"></div>
                                <div className="knob-pannel">
                                    <Knob
                                        style={{ display: "inline-block" }}
                                        min={1}
                                        max={20000}
                                        unlockDistance={0}
                                        value={this.state.attack}
                                        onChange={v => this.handleParamChange('attack', v)}
                                        label='Attack'
                                    />
                                    <Knob
                                        style={{ display: "inline-block" }}
                                        min={1}
                                        max={20000}
                                        unlockDistance={0}
                                        value={this.state.sustain}
                                        onChange={v => this.handleParamChange('decay', v)}
                                        label="Decay"
                                    />
                                    <Knob
                                        style={{ display: "inline-block" }}
                                        min={1}
                                        max={1000}
                                        unlockDistance={0}
                                        value={this.state.decay}
                                        onChange={v => this.handleParamChange('sustain', v)}
                                        label='Sustain'
                                    />
                                    <Knob
                                        style={{ display: "inline-block" }}
                                        min={1}
                                        max={20000}
                                        unlockDistance={0}
                                        value={this.state.release}
                                        onChange={(v) => this.handleParamChange('release', v)}
                                        label="Release"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }}
            </Subscribe>
        );
    }

    handleParamChange = (name: string, value: number) => {
        this.props.onParamChange(name, value);
        this.setState({ [name]: value });
    }
}