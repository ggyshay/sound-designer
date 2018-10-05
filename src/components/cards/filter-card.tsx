import * as React from 'react';
import { CardComponentProps } from './oscillator-card';
import { Connector } from '../../atoms';
import { FilterTypes } from '../../atoms/audio-engine';
import { Knob } from '../../atoms/knob';
import { CardNodeProvider } from '../../providers/card-node.provider';
import { Subscribe } from 'unstated';

export class FilterCard extends React.Component<CardComponentProps, any>{
    private width = 205;
    private height = 285;

    private cardNodeProvider: CardNodeProvider = null;

    constructor(props) {
        super(props);

        this.state = {
            frequency: 20,
            Q: 1,
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