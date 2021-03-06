import _ from 'lodash';
import { Container } from 'unstated';
import { CardNode } from '../components';
import * as React from 'react';
import { EngineComponent } from 'src/components/engine-component';

interface CardNodeProviderState {
    nodes: CardNode[];
}

export class CardNodeProvider extends Container<CardNodeProviderState> {
    constructor() {
        super();
        this.state = {
            nodes: [{
                x: 1000, y: 300, id: 'Output', type: 'Output', connectors: [], engine: null,
                engRef: React.createRef<EngineComponent>()
            },
            {
                x: 100, y: 300, id: 'Input', type: 'Input', connectors: [], engine: null,
                engRef: React.createRef<EngineComponent>()
            },
            {
                x: 300, y: 300, id: 'Oscillator0', type: 'Oscillator', connectors: [], engine: null,
                engRef: React.createRef<EngineComponent>()
            },
            {
                x: 600, y: 300, id: 'Envelope0', type: 'Envelope', connectors: [], engine: null,
                engRef: React.createRef<EngineComponent>()
            },]
        };
    }

    removeNodeWithId = (id: string) => {
        const nodes = this.state.nodes.slice(0);
        const index = nodes.findIndex(n => n.id === id);
        nodes.splice(index, 1);
        this.updateNodes(nodes);
    }

    getNodeWithId = (id): CardNode => {
        return this.state.nodes.find((n: CardNode) => n.id === id);
    }

    pushNode = async (n: CardNode) => {
        const nodes = this.state.nodes.slice(0);
        n.id = n.type + nodes.length;
        nodes.push(n);
        if (_.isEqual(nodes, this.state.nodes)) { return }
        await this.setState({ nodes });
    }

    updateNodes = async (nodes: CardNode[]) => {
        if (_.isEqual(nodes, this.state.nodes)) { return }
        await this.setState({ nodes });
    }

    updateNode = async (node: CardNode, id: string) => {
        const nodes = this.state.nodes.slice(0);
        const nodeIndex = nodes.findIndex((n) => n.id === id);
        nodes[nodeIndex] = node;
        if (_.isEqual(nodes, this.state.nodes)) { return }
        await this.setState({ nodes });
    }

    renewConnections = (timeout?:number) => {
        this.state.nodes.forEach(node => {
            node.engRef.current.setup();
        });
        this.state.nodes.forEach(node => {
            node.engRef.current.renewConnections();
        });
        this.state.nodes.forEach(node => {
            node.engRef.current.tryStart();
        });
        if(timeout){
            this.state.nodes.forEach(node => {
                setTimeout(() => node.engRef.current.tryStop(), timeout) 
            })
        }
    }
}