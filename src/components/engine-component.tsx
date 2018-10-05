import _ from 'lodash';
import * as React from 'react';
import { Subscribe } from 'unstated';
import { ConnectionMeta, ConnectorMeta } from '../atoms';
import { AudioEngine } from '../atoms/audio-engine';
import { CardNodeProvider } from '../providers/card-node.provider';
import { ConnectionProvider } from '../providers/connection.provider';
import { CardNode } from './canvas';


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

    constructor(props: EngineComponentProps) {
        super(props);
        this.state = {
            connections: [],
            connect: null,
            connectors: [],
        }
        this.engine = new AudioEngine(this.props.ctx, this.props.type);
        this.setup();
    }
    componentWillMount() { this.createConnectors(); }
    componentDidUpdate() { if (this.props.connect) this.checkConnect(); }
    componentDidMount() { this.updateProviderData(); }

    render() {
        const { children } = this.props;
        const childrenWithProps = React.Children.map(children, (child: any) =>
            React.cloneElement(child, {
                connectors: this.state.connectors, connect: this.state.connect,
                connectorsCreateCB: (connectors: ConnectorMeta[], id: string) => this.props.connectorsCreateCB(connectors, id, this.engine),
                onParamChange: this.handleParamChange,
            }));

        return (
            <Subscribe to={[CardNodeProvider, ConnectionProvider]}>
                {(cnc: CardNodeProvider, cp: ConnectionProvider) => {
                    this.cardNodeProvider = cnc;
                    this.connectionProvider = cp;

                    return <div>{childrenWithProps}</div>
                }}
            </Subscribe>
        );
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
            case 'Output':
                connectors = { inputs: ['InSignal'], outputs: [] };
                break;
            case 'Filter':
                connectors = { inputs: ['InSignal', 'cutoff', 'resonance'], outputs: ['OutSignal'] }
                break;
            case 'Envelope':
                connectors = { inputs: ['InSignal'], outputs: ['OutSignal'] }
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
