import * as React from 'react';
import { Subscribe } from 'unstated';
import { Connector } from '../../atoms';
import { FilterTypes } from '../../atoms/audio-engine';
import { Knob } from '../../atoms/knob';
import { CardNodeProvider } from '../../providers/card-node.provider';
import { CardComponentProps } from './oscillator-card';

export class EnvelopeCard extends React.Component<CardComponentProps, any>{
    private width = 300;
    private height = 225;

    private cardNodeProvider: CardNodeProvider = null;

    constructor(props) {
        super(props);

        this.state = {
            attack: null,
            decay: null,
            sustain: null,
            release: null,
            connectors: []
        }
    }

    componentDidMount() { this.setupConnectors(); }
    setupConnectors = () => {
        const { Position: { x, y }, id, connectors: { inputs, outputs } } = this.props
        const connectors = []
        inputs.map((inp, idx) => {
            connectors.push({
                Position: { x: x - 7, y: y + 50 + idx * 30 }, isOutp: false,
                id: id + inp, parentX: x, parentY: y, parentId: id, connections: [], type: inp
            })
        })
        outputs.map((outp, idx) => {
            connectors.push({
                Position: { x: x + this.width - 7, y: y + 50 + idx * 30 }, isOutp: true,
                id: id + outp, parentX: x, parentY: y, parentId: id, connections: [], type: outp
            })
        })
        const node = this.cardNodeProvider.getNodeWithId(this.props.id);
        node.connectors = connectors;
        this.cardNodeProvider.updateNode(node, this.props.id);
        this.setState({ connectors });
    }

    render() {
        return (
            <Subscribe to={[CardNodeProvider]}>{
                (cnc: CardNodeProvider) => {
                    this.cardNodeProvider = cnc;
                    return (
                        <div>
                            {this.state.connectors.map(cn => {
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
                            <div className="card" onMouseDown={this.props.handleCardDrag}
                                style={{ width: this.width, height: this.height }}>
                                <div className="card-header unselectable">
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
                                        value={this.state.frequency}
                                        onChange={v => this.handleParamChange('decay', v)}
                                        label="Decay"
                                    />
                                    <Knob
                                        style={{ display: "inline-block" }}
                                        min={1}
                                        max={1000}
                                        unlockDistance={0}
                                        value={this.state.frequency}
                                        onChange={v => this.handleParamChange('sustain', v)}
                                        label='Sustain'
                                    />
                                    <Knob
                                        style={{ display: "inline-block" }}
                                        min={1}
                                        max={20000}
                                        unlockDistance={0}
                                        value={this.state.frequency}
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