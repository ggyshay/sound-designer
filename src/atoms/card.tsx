import * as React from 'react';
import { EnvelopeCard, FilterCard } from '../components/cards';
import { OscillatorCard } from '../components/cards/oscillator-card';
import { OutputCard } from '../components/cards/output-card';
import './card.css';

export interface CardProps {
    Position: { x: number, y: number }
    id: string;
    type: string;
    connectors?: { inputs: string[], outputs: string[] };
    connect?: { Outp: ConnectorMeta, Inp: ConnectorMeta };
    onConnectorDrag: (metadata: any) => void;
    onConnectorDetected: (metadata: any) => void;
    onConnectorLost: (e: any) => void;
    handleCardDrag: (e: any, id: string) => void;
    connectorsCreateCB?: (connectors: ConnectorMeta[], id: string) => void;
    onParamChange?: (param: string, value: string | number) => void;
}

export type ConnectorMeta = {
    Position: { x: number, y: number }
    id: string;
    isOutp: boolean;
    connections: { id: string, parentId: string }[];
    parentId: string;
    parentX: number,
    parentY: number,
    type: string,
}

export class Card extends React.Component<CardProps> {

    public render() {
        return (
            <div className="card-holder" style={{ left: this.props.Position.x, top: this.props.Position.y }}>
                {this.renderCards()}
            </div>
        )
    }

    handleCardDrag = e => {
        this.props.handleCardDrag(e, this.props.id);
    }

    renderCards = () => {
        const props = {
            onParamChange: this.props.onParamChange,
            handleCardDrag: this.handleCardDrag,
            connectors: this.props.connectors,
            Position: this.props.Position,
            id: this.props.id,
            onConnectorDetected: this.props.onConnectorDetected,
            onConnectorDrag: this.props.onConnectorDrag,
            onConnectorLost: this.props.onConnectorLost,
        }

        switch (this.props.type) {
            case 'Filter': return <FilterCard {...props} />
            case 'Envelope': return <EnvelopeCard {...props} />
            case 'Output': return <OutputCard {...props} />
            default: return <OscillatorCard {...props} />
        }
    }
}
