import * as React from 'react';
import { Subscribe } from 'unstated';
import { EnvelopeCard, FilterCard } from '../components/cards';
import { OscillatorCard } from '../components/cards/oscillator-card';
import { OutputCard } from '../components/cards/output-card';
import { CardNodeProvider } from '../providers/card-node.provider';
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

export interface CardState {

}

export class Card extends React.Component<CardProps, CardState> {
    private cardNodeProvider: CardNodeProvider = null;
    constructor(props: CardProps) {
        super(props);
        this.state = {
            connectors: [],
        }
    }

    public render() {
        return (
            <Subscribe to={[CardNodeProvider]}>
                {(cnc: CardNodeProvider) => {
                    this.cardNodeProvider = cnc;
                    return (
                        <div className="card-holder" style={{ left: this.props.Position.x, top: this.props.Position.y }}>
                            {this.renderCards()}
                        </div>
                    )
                }}
            </Subscribe>
        );

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
