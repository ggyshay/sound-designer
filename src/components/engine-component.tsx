import _ from 'lodash';
import * as React from 'react';
import { Subscribe } from 'unstated';
import { ConnectionMeta, ConnectorMeta } from '../atoms';
import { AudioEngine, EngineTypeStrings } from '../atoms/audio-engine';
import { CardNodeProvider } from '../providers/card-node.provider';
import { ConnectionProvider } from '../providers/connection.provider';
import { CardNode } from './canvas';
import { SelectionProvider } from '../providers/selection.provider';
import { OutputCardParams } from './cards/output-card';
import { filterParams, envelopeParams } from './cards';
import { OscillatorParams } from './cards/oscillator-card';
import { InputCardParams } from './cards/input-card';


export interface EngineComponentProps {
    type: string;
    connect: { Outp: ConnectorMeta, Inp: ConnectorMeta };
    ctx: AudioContext;
    connectorsCreateCB: (connectors: ConnectorMeta[], id: string, engine: AudioEngine) => void
    nodeId: string;
}

export class EngineComponent extends React.Component<EngineComponentProps, any> {
    private engine: AudioEngine = null;
    private cardNodeProvider: CardNodeProvider = null;
    private connectionProvider: ConnectionProvider = null;
    private selectionProvider: SelectionProvider = null;

    constructor(props: EngineComponentProps) {
        super(props);
        this.state = {
            connections: [],
            connect: null,
            connectors: [],
        }
        this.engine = new AudioEngine(this.props.ctx, this.props.type);
        this.setup();
        document.addEventListener('keydown', this.handleKeyDown)
    }
    componentWillMount() { this.createConnectors(); }
    componentDidUpdate() { if (this.props.connect) this.checkConnect(); }
    componentDidMount() {
        this.updateProviderData();
        this.engine.setNodeProviderRef(this.cardNodeProvider);
    }

    render() {
        const { children } = this.props;
        const childrenWithProps = React.Children.map(children, (child: any) =>
            React.cloneElement(child, {
                connectors: this.state.connectors, connect: this.state.connect,
                connectorsCreateCB: (connectors: ConnectorMeta[], id: string) => this.props.connectorsCreateCB(connectors, id, this.engine),
                onParamChange: this.handleParamChange,
                getFrequencyResponse: this.getFrequencyResponse
            }));

        return (
            <Subscribe to={[CardNodeProvider, ConnectionProvider, SelectionProvider]}>
                {(cnc: CardNodeProvider, cp: ConnectionProvider, sp: SelectionProvider) => {
                    this.cardNodeProvider = cnc;
                    this.connectionProvider = cp;
                    this.selectionProvider = sp;

                    return <div>{childrenWithProps}</div>
                }}
            </Subscribe>
        );
    }

    handleKeyDown = e => {
        if (!(e.key === 'Backspace')) return;
        if (this.selectionProvider.isNode()) {
            if (this.selectionProvider.state.id === this.props.nodeId) {
                // remove all connections and try stop engine
                this.engine.disconnect();
            } else {
                //look for connection with the selcted node and disconnect
            }
        }
        else if (this.selectionProvider.state.parentId === this.props.nodeId) {
            const inNode = this.cardNodeProvider.getNodeWithId(this.selectionProvider.state.destParentId);
            const inCon = inNode.connectors.find(inCn => inCn.id === this.selectionProvider.state.destId);
            const outNode = this.cardNodeProvider.getNodeWithId(this.props.nodeId);
            const outCon = outNode.connectors.find(cn => cn.id === this.selectionProvider.state.id);
            this.engine.disconnect(inNode.engine, outCon.type, inCon.type)
        }
    }

    updateProviderData = () => {
        const node = this.cardNodeProvider.getNodeWithId(this.props.nodeId);
        node.engine = this.engine;
        this.cardNodeProvider.updateNode(node, node.id);
    }

    checkConnect = () => {
        if (_.isEqual(this.state.connect, this.props.connect)) return;
        if (this.props.connect.Outp && this.props.connect.Inp) {
            if (!this.areConnected(this.props.connect.Inp, this.props.connect.Outp)) {
                this.setState({ connect: this.props.connect })
            } else {
                this.connectionProvider.cleanConnection();
            }
        } else {
            this.setState({ connect: null })
        }
    }

    connectEngines = (inNode: CardNode, outParameter: string, inParameter: string) => {
        this.engine.connect(inNode.engine, outParameter, inParameter);
    }

    renewConnections = () => {
        const node = this.cardNodeProvider.getNodeWithId(this.props.nodeId);
        node.connectors.forEach(cn => {
            if (!cn.isOutp) { return }
            cn.connections.forEach(conn => {
                const inNode = this.cardNodeProvider.getNodeWithId(conn.parentId);
                const inCon = inNode.connectors.find(inCn => inCn.id === conn.id);
                this.connectEngines(inNode, cn.type, inCon.type);
            });
        })
    }

    setup = () => {
        this.engine.setup();
    }

    tryStart = (time?: number) => {
        this.engine.start(time);
    }

    areConnected = (inCon: ConnectorMeta, outCon: ConnectorMeta) => {
        return !!outCon.connections.find((cn: ConnectionMeta) => (cn.id === inCon.id));
    }

    createConnectors = () => {
        let connectors = null
        switch (this.props.type) {
            case EngineTypeStrings.output:
                connectors = { inputs: [OutputCardParams.input], outputs: [] };
                break;
            case EngineTypeStrings.filter:
                connectors = { inputs: [filterParams.input, filterParams.frequency, filterParams.Q], outputs: [filterParams.output] }
                break;
            case EngineTypeStrings.envelope:
                connectors = { inputs: [envelopeParams.input], outputs: [envelopeParams.output] }
                break;
            case EngineTypeStrings.input:
                connectors = { inputs: [], outputs: [InputCardParams.output] }
                break;
            case EngineTypeStrings.oscillator:
                connectors = { inputs: [OscillatorParams.frequency], outputs: [OscillatorParams.output] }
                break;
            case EngineTypeStrings.fixedInput:
                connectors = { inputs: [], outputs: [InputCardParams.output] }
                break;
            case EngineTypeStrings.LFO:
                connectors = { inputs: [OscillatorParams.frequency], outputs: [OscillatorParams.output] };
                break;
            default: throw new Error('invalid engine type string for engine component connectors creation');
        }
        this.setState({ connectors })
    }

    getFrequencyResponse = (inputFrequencies) => {
        if (this.props.type !== EngineTypeStrings.filter) return;
        return this.engine.getFrequencyResponse(inputFrequencies);
    }

    handleParamChange = (param: string, value: string | number) => {
        if (this.engine) {
            this.engine.changeParam(param, value)
        }
    }
}
