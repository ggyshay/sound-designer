import _ from 'lodash';
import * as React from 'react';
import { ConnectorMeta } from '../atoms';
import { findNodeWithId } from '../utils/nodeOperations';
import { CardNode } from './canvas';
import { AudioEngine } from '../atoms/audio-engine';


export interface EngineComponentProps {
    type: string;
    connect: { Outp: ConnectorMeta, Inp: ConnectorMeta };
    connectionCallback: () => void;
    ctx: AudioContext;
    connectorsCreateCB: (connectors: ConnectorMeta[], id: string, engine: AudioEngine) => void
    nodes: CardNode[];
}

export class EngineComponent extends React.Component<EngineComponentProps, any> {
    private engine: AudioEngine = null;
    constructor(props: EngineComponentProps) {
        super(props);
        this.state = {
            connections: [],
            connect: null,
            connectors: [],
        }
        this.engine = new AudioEngine(this.props.ctx, this.props.type);
        this.engine.setup();
    }
    componentWillMount() { this.createConnectors(); }
    componentDidUpdate() { if (this.props.connect) this.checkConnect(); }

    render() {
        const { children } = this.props;
        const childrenWithProps = React.Children.map(children, (child: any) =>
            React.cloneElement(child, {
                connectors: this.state.connectors, connect: this.state.connect,
                connectorsCreateCB: (connectors: ConnectorMeta[], id: string) => this.props.connectorsCreateCB(connectors, id, this.engine),
                onParamChange: this.handleParamChange,
            }));

        return <div>{childrenWithProps}</div>
    }

    checkConnect = () => {
        if (_.isEqual(this.state.connect, this.props.connect)) return;
        if (this.props.connect.Outp && this.props.connect.Inp) {
            if (!this.areConnected(this.props.connect.Inp, this.props.connect.Outp)) {
                this.setState({ connect: this.props.connect })
                this.connectEngines(findNodeWithId(this.props.connect.Outp.parentId, this.props.nodes),
                    findNodeWithId(this.props.connect.Inp.parentId, this.props.nodes),
                    this.props.connect.Outp.type, this.props.connect.Inp.type)
            } else {
                this.props.connectionCallback();
            }
        } else {
            this.setState({ connect: null })
        }
    }

    connectEngines = (outNode: CardNode, inNode: CardNode, outParameter: string, inParameter: string) => {
        this.engine.connect(inNode.engine, outParameter, inParameter);
    }

    areConnected = (inCon: ConnectorMeta, outCon: ConnectorMeta) => {
        return !!outCon.connections.find((cn: ConnectorMeta) => (cn.id === inCon.id));
    }

    createConnectors = () => {
        let connectors = null
        switch (this.props.type) {
            case 'Output':
                connectors = { inputs: ['InSignal'], outputs: [] };
                break;
            case 'Filter':
                connectors = { inputs: ['InSignal', 'cutoff', 'resonance'], outputs: ['OutSignal'] }
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

    handleParamChange = (param: string, value: string | number) => {
        if (this.engine) {
            this.engine.changeParam(param, value)
        }
    }
}
