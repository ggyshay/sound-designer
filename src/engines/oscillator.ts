import { OscillatorTypes } from "src/atoms";
import { BaseEngine } from "./base-engine";

export class Oscillator extends BaseEngine {
    public input: OscillatorNode;
    public frequency: GainNode;
    private ctx: AudioContext;
    private params: { frequency: number, type: OscillatorType }
    public proxy: GainNode;

    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.params = { frequency: 440, type: 'sine' }
    }

    setup = () => {
        this.input = new OscillatorNode(this.ctx);
        this.input.frequency.value = this.params.frequency;
        this.input.type = this.params.type;

        this.frequency = new GainNode(this.ctx);
        this.frequency.gain.value = this.params.frequency;

        this.proxy = new GainNode(this.ctx);

        this.frequency.connect(this.proxy);
        this.proxy.connect(this.input.frequency);
    }

    changeParam = (param: string, value: number | string): void => {
        if (param === 'frequency' && typeof value === 'number') {
            this.frequency.gain.value = value;
            this.params.frequency = value;
            this.input.frequency.value = value;
        } else if (param === 'type' && typeof value === 'string' && isOscillatorType(value)) {
            this.input.type = value;
            this.params.type = value;
        }
    }
}

export const isOscillatorType = (t: string): t is OscillatorType => {
    switch (t) {
        case (OscillatorTypes.saw): return true;
        case (OscillatorTypes.square): return true;
        case (OscillatorTypes.triangle): return true;
        case (OscillatorTypes.sine): return true;
        default: return false;
    }
}