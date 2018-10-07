import * as React from 'react';
import { EnvelopeCard, FilterCard } from '../components/cards';
import { OscillatorCard } from '../components/cards/oscillator-card';
import { OutputCard } from '../components/cards/output-card';
import './card.css';
import { SelectionProvider } from '../providers/selection.provider';
import { CardNodeProvider } from '../providers/card-node.provider';
import { Subscribe } from 'unstated';
import _ from 'lodash';

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
    connectors: ConnectorMeta[];
}

export class Card extends React.Component<CardProps, CardState> {
    private selectionProvider: SelectionProvider = null;
    private cardNodeProvider: CardNodeProvider = null;

    public width: number = 0;
    public height: number = 0;

    constructor(props) {
        super(props);
        this.state = {
            connectors: [],
        }

        document.addEventListener('keydown', this.handleKeyDown)
    }

    componentDidMount() { this.setupConnectors(); }
    componentDidUpdate() { this.updateConnectors(); }

    public render() {
        return (
            <Subscribe to={[CardNodeProvider, SelectionProvider]}>
                {(cardNodeProvider: CardNodeProvider, selectionProvider: SelectionProvider) => {
                    this.cardNodeProvider = cardNodeProvider;
                    this.selectionProvider = selectionProvider;

                    return (
                        <div className="card-holder" style={{ left: this.props.Position.x, top: this.props.Position.y }}>
                            {this.renderCards()}
                        </div>
                    )
                }}
            </Subscribe>
        )
    }

    setupConnectors = () => {
        switch (this.props.type) {
            case 'Filter': this.width = 205; this.height = 285; break;
            case 'Envelope':  this.width = 300; this.height = 225; break;
            case 'Output':  this.width = 80; this.height = 80; break;
            default:  this.width = 192; this.height = 250; break;
        }
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

    handleCardDrag = e => {
        this.props.handleCardDrag(e, this.props.id);
    }

    renderCards = () => {
        const props = {
            connectors: this.state.connectors,
            Position: this.props.Position,
            id: this.props.id,
            onCardClick: this.handleCardSelect,
            onParamChange: this.props.onParamChange,
            handleCardDrag: this.handleCardDrag,
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


    handleCardSelect = () => this.selectionProvider.select(this.props.id);

    updateConnectors = () => {
        const connectors = this.state.connectors.slice(0);
        connectors.forEach((cn: ConnectorMeta) => {
            const connections = cn.connections.filter(cnn => !!this.cardNodeProvider.getNodeWithId(cnn.parentId));
            cn.connections = connections;
        });
        if (!_.isEqual(this.state.connectors, connectors))
            this.setState({ connectors });
    }

    handleKeyDown = e => {
        if (!(e.key === 'Backspace')) return;
        if (this.selectionProvider.isNode() && this.selectionProvider.state.id === this.props.id) {
            this.cardNodeProvider.removeNodeWithId(this.props.id);
        } else if (this.selectionProvider.state.parentId === this.props.id) {
            const connectors = this.state.connectors.slice(0);
            connectors.forEach((cn: ConnectorMeta) => {
                if (cn.id === this.selectionProvider.state.id) {
                    const index = cn.connections.findIndex(cnn => cnn.id === this.selectionProvider.state.destId);
                    cn.connections.splice(index, 1);
                    this.selectionProvider.cleanSelection();
                }
            });
            this.setState({ connectors })
        }
    }
}
