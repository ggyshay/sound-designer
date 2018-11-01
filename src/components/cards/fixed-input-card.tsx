import * as React from 'react';
import { Subscribe } from 'unstated';
import { Connector, ConnectorMeta } from '../../atoms';
import { SelectionProvider } from '../../providers/selection.provider';
import './cards.css';

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

export class FixedInputCard extends React.Component<CardComponentProps, any>{
    private selectionProvider: SelectionProvider = null;
    constructor(props) {
        super(props);
        this.state = {
            value: 440,
        }
    }

    render() {
        return (
            <Subscribe to={[SelectionProvider]} >
                {(selectionProvider: SelectionProvider) => {
                    this.selectionProvider = selectionProvider;
                    const classname = 'field-card' + (this.selectionProvider.isSelected(this.props.id) ? ' selected' : '')
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
                            <div className={classname} onMouseDown={this.props.handleCardDrag} id="card-body">
                                <input className="frequency-input" onChange={this.handleValueChange}
                                value={this.state.value + ' Hz'} onFocus={() => this.selectionProvider.cleanSelection()}/>
                            </div>
                        </div>);
                }}
            </Subscribe>
        )
    }

    handleValueChange = e => {
        const value = e.target.value.replace(/[^(0-9.)]/gm, '');
        this.props.onParamChange('offset', value)
        this.setState({ value });
    }
}
