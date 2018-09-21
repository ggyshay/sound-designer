import * as React from 'react';
import { Card, ConnectorMeta } from '../atoms';
import { CardNode } from './canvas';
import _ from 'lodash';

export interface EngineComponentProps {
    type: string;
    Position: { x: number, y: number }
    id: string;
    connect: { Outp: ConnectorMeta, Inp: ConnectorMeta };
    nodes: CardNode[];
    onConnectorDrag: (metadata: any) => void;
    onConnectorDetected: (metadata: any) => void;
    onConnectorLost: (e: any) => void;
    handleCardDrag: (e: any, id: string) => void;
    connectionCallback: () => void;
    connectorsCreateCB: (connectors: ConnectorMeta[], id: string) => void;
}

export class EngineComponent extends React.Component<EngineComponentProps, any> {
    constructor(props: EngineComponentProps) {
        super(props);
        this.state = {
            connections: [],
            connect: null,
            connectors: [],
        }
    }
    componentWillMount() { this.createConnectors(); }
    componentDidUpdate() { if (this.props.connect) this.checkConnect(); }

    render() {
        // TODO:
        // create audio node

        return (
            <Card
                Position={this.props.Position}
                id={this.props.id}
                type={this.props.type}
                connectors={this.state.connectors}
                connect={this.state.connect}
                nodes={this.props.nodes}

                onConnectorDrag={this.props.onConnectorDrag}
                onConnectorDetected={this.props.onConnectorDetected}
                onConnectorLost={this.props.onConnectorLost}
                handleCardDrag={this.props.handleCardDrag}
                connectionCallback={this.props.connectionCallback}
                connectorsCreateCB={this.props.connectorsCreateCB}
            />
        );
    }

    checkConnect = () => {
        if (_.isEqual(this.state.connect, this.props.connect)) return;
        if (this.props.connect.Outp && this.props.connect.Inp) {
            if (!this.areConnected(this.props.connect.Inp, this.props.connect.Outp)) {
                this.setState({ connect: this.props.connect })
            } else {
                this.props.connectionCallback();
            }
        } else {
            this.setState({ connect: null })
        }
    }

    areConnected = (inCon: ConnectorMeta, outCon: ConnectorMeta) => {
        return !!outCon.connections.find((cn: ConnectorMeta) => (cn.id === inCon.id));
    }

    createConnectors = () => {
        let connectors = null
        switch (this.props.type) {
            case 'Filter':
                connectors = { inputs: ['Cutoff', 'Resonance', 'InSignal'], outputs: ['OutSignal'] }
                break;
            case 'Envelope':
                connectors = { inputs: ['Attack', 'Decay', 'Sustain', 'Release', 'InSignal'], outputs: ['OutSignal'] }
                break;
            default:
                connectors = { inputs: ['Frequency'], outputs: ['OutSignal'] }
                break;

        }
        this.setState({ connectors })
    }
}