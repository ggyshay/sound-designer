export class EnvelopeNode {
    private ctx: AudioContext;
    private state: any;
    private gain: GainNode;

    constructor(ctx: AudioContext) {
        this.ctx = ctx;
        this.state = {
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
        }
        this.setup();
    }

    start = () => {
        if (this.state.attack && this.state.decay && this.state.sustain && this.state.release) {
            this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
            this.gain.gain.exponentialRampToValueAtTime(1, this.ctx.currentTime + this.state.attack);
            this.gain.gain.exponentialRampToValueAtTime(this.state.sustain, this.ctx.currentTime + this.state.attack + this.state.decay);
            this.gain.gain.exponentialRampToValueAtTime(0.0001,
                this.ctx.currentTime + this.state.attack + this.state.decay + this.state.release);
        }
    }

    stop = () => {
        this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
    }

    setup = () => {
        this.gain = new GainNode(this.ctx);
    }

    connect(destinationNode: AudioNode, output?: number, input?: number): AudioNode;
    connect(destinationParam: AudioParam, output?: number): void;
    connect(destination: any, output?: number, input?: number): any {
        this.gain.connect(destination, output, input);
    }
}