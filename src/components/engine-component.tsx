import _ from 'lodash';
import * as React from 'react';
import { ConnectorMeta } from '../atoms';
import { CardNode } from './canvas';

export interface EngineComponentProps {
    type: string;
    connect: { Outp: ConnectorMeta, Inp: ConnectorMeta };
    connectionCallback: () => void;
    ctx: AudioContext;
    connectorsCreateCB: (connectors: ConnectorMeta[], id: string, engine: AudioNode) => void
    nodes: CardNode[];
}

export type EngineType = OscillatorNode|BiquadFilterNode|GainNode|AudioDestinationNode

export class EngineComponent extends React.Component<EngineComponentProps, any> {
    private engine:EngineType = null;
    constructor(props: EngineComponentProps) {
        super(props);
        this.state = {
            connections: [],
            connect: null,
            connectors: [],
        }

        switch (props.type) {
            case 'Oscillator':
                this.engine = this.props.ctx.createOscillator();
                this.engine.start();
                break;
            case 'Filter':
                this.engine = this.props.ctx.createBiquadFilter();
                break;
            case 'Envelope':
                this.engine = this.props.ctx.createGain();
                break;
            case 'Output': 
                this.engine = this.props.ctx.destination;
        }
    }
    componentWillMount() { this.createConnectors(); }
    componentDidUpdate() { if (this.props.connect) this.checkConnect(); }

    render() {
        const { children } = this.props;
        const childrenWithProps = React.Children.map(children, (child: any) =>
            React.cloneElement(child, {
                connectors: this.state.connectors, connect: this.state.connect,
                connectorsCreateCB: (connectors: ConnectorMeta[], id: string) => this.props.connectorsCreateCB(connectors, id, this.engine)
            }));

        return <div>{childrenWithProps}</div>
    }

    checkConnect = () => {
        if (_.isEqual(this.state.connect, this.props.connect)) return;
        if (this.props.connect.Outp && this.props.connect.Inp) {
            if (!this.areConnected(this.props.connect.Inp, this.props.connect.Outp)) {
                this.setState({ connect: this.props.connect })
                this.connectEngines(this.findNodeWithId(this.props.connect.Outp.parentId),
                    this.findNodeWithId(this.props.connect.Inp.parentId), this.props.connect.Outp.type, this.props.connect.Inp.type)
            } else {
                this.props.connectionCallback();
            }
        } else {
            this.setState({ connect: null })
        }
    }

    connectEngines = (outNode: CardNode, inNode: CardNode, outParameter: string, inParameter: string) => {
        if (outParameter === 'OutSignal' && inParameter === "InSignal") {
            outNode.engine.connect(inNode.engine);
        } else if (outParameter === 'OutSignal') {
            outNode.engine.connect(inNode.engine[inParameter]);
        } else if (inParameter === 'InSignal') {
            outNode.engine[outParameter].connect(inNode.engine);
        } else {
            outNode.engine[outParameter].connect(inNode.engine[inParameter]);
        }
    }

    areConnected = (inCon: ConnectorMeta, outCon: ConnectorMeta) => {
        return !!outCon.connections.find((cn: ConnectorMeta) => (cn.id === inCon.id));
    }

    findNodeWithId = (id: string) => {
        if (!this.props.nodes) { return }
        return this.props.nodes.find((n: CardNode) => n.id === id);
    }

    createConnectors = () => {
        let connectors = null
        switch (this.props.type) {
            case 'Output':
                connectors = { inputs: ['InSignal'], outputs: [] };
                break;
            case 'Filter':
                connectors = { inputs: ['cutoff', 'resonance', 'InSignal'], outputs: ['OutSignal'] }
                break;
            case 'Envelope':
                connectors = { inputs: ['Attack', 'Decay', 'Sustain', 'Release', 'InSignal'], outputs: ['OutSignal'] }
                break;
            default:
                connectors = { inputs: ['frequency'], outputs: ['OutSignal'] }
                break;

        }
        this.setState({ connectors })
    }
}
