import { BaseEngine } from './'
import { CardNodeProvider } from 'src/providers/card-node.provider';
import noteDispatcher from 'src/providers/note-dispatcher';

const semitone = Math.pow(2, 1 / 12);

export class Input extends BaseEngine {
    public input: ConstantSourceNode;
    private ctx: AudioContext;
    private params: { offset: number, semitoneShift: number }
    private pressing: boolean;
    private nodeProvider: CardNodeProvider;

    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.params = { offset: 440, semitoneShift: 0 }
        noteDispatcher.onKeyPress(this.handleKeyPress);
        noteDispatcher.onMIDIPress(this.handleMIDIPress)
        noteDispatcher.onMIDIUp(() => this.pressing = false);
        noteDispatcher.onKeyUp(() => this.pressing = false);
        this.setup();
        this.pressing = false;
    }

    setup = () => {
        this.input = new ConstantSourceNode(this.ctx);
        this.input.offset.value = this.params.offset;
        this.input.start();
    }

    handleKeyPress = key => {
        const item = piano.find(it => it.key === key);
        if (!item || (this.pressing && item.frequency === this.params.offset)) return;
        this.changeOffset(item.frequency)
    }

    changeOffset = off => {
        this.input.offset.value = off * Math.pow(semitone, this.params.semitoneShift);
        this.params.offset = off;
        this.pressing = true;
        this.nodeProvider.renewConnections();
    }

    changeParam = (param: string, value: number|string) => {
        if(typeof value === 'number'){
            this.params.semitoneShift = value;
        }
        this.changeOffset(this.params.offset);
    }

    setNodeProviderRef = nc => {
        this.nodeProvider = nc;
    }

    handleMIDIPress = f => {
        this.changeOffset(f);
        this.pressing = true;
    }
}

export const piano = [
    { key: 'a', frequency: 262 },
    { key: 'w', frequency: 278 },
    { key: 's', frequency: 294 },
    { key: 'e', frequency: 311 },
    { key: 'd', frequency: 330 },
    { key: 'f', frequency: 349 },
    { key: 't', frequency: 370 },
    { key: 'g', frequency: 392 },
    { key: 'y', frequency: 415 },
    { key: 'h', frequency: 440 },
    { key: 'u', frequency: 466 },
    { key: 'j', frequency: 494 },
    { key: 'k', frequency: 523 },
    { key: 'o', frequency: 554 },
    { key: 'l', frequency: 587 },
    { key: 'p', frequency: 622 },
]