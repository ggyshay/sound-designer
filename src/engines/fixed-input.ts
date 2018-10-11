import { BaseEngine } from '.'
import { CardNodeProvider } from 'src/providers/card-node.provider';

export class FixedInput extends BaseEngine {
    public input: ConstantSourceNode;
    private ctx: AudioContext;
    private params: { offset: number }
    private pressing: boolean;
    private nodeProvider: CardNodeProvider;

    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.params = { offset: 440 }
        this.setup();
        this.pressing = false;
    }

    setup = () => {
        this.input = new ConstantSourceNode(this.ctx);
        this.input.offset.value = this.params.offset;
        this.input.start();
    }

    changeParam = (param: string, value: number) => {
        if (param !== 'offset') return;
        this.changeOffset(value);
    }

    changeOffset = off => {
        this.input.offset.value = off;
        this.params.offset = off;
        this.pressing = true;
        this.nodeProvider.renewConnections();
    }

    setNodeProviderRef = nc => {
        this.nodeProvider = nc;
    }
}