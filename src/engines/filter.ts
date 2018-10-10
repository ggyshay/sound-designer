import { BaseEngine } from "./base-engine";
import { FilterTypes } from "src/atoms";

export class Filter extends BaseEngine {
    public input: BiquadFilterNode;
    public frequency: GainNode;
    public Q: GainNode;
    private ctx: AudioContext;
    private params: { frequency: number, Q: number, type: BiquadFilterType }

    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.params = { frequency: 350, Q: 1, type: FilterTypes.LPF }
    }

    setup = () => {
        this.input = new BiquadFilterNode(this.ctx);
        this.frequency = new GainNode(this.ctx);
        this.Q = new GainNode(this.ctx);

        this.input.frequency.value = this.params.frequency;
        this.input.Q.value = this.params.Q;
        this.input.type = this.params.type;

        this.frequency.gain.value = this.params.frequency;
        this.Q.gain.value = this.params.Q;

        this.frequency.connect(this.input.frequency);
        this.Q.connect(this.input.Q);
    }

    changeParam = (param: string, value: number | string): void => {
        if (param === 'frequency' && typeof value === 'number') {
            this.frequency.gain.value = value;
            this.params.frequency = value;
            this.input.frequency.value = value;
        } else if (param === 'type' && typeof value === 'string' && isFilterType(value)) {
            this.input.type = value;
            this.params.type = value;
        } else if (param === 'Q' && typeof value === 'number') {
            this.input.gain.value = value;
            this.params.Q = value;
        }
    }
}

export const isFilterType = (t: string): t is BiquadFilterType => {
    switch(t){
        case(FilterTypes.LPF): return true;
        case(FilterTypes.HPF): return true;
        case(FilterTypes.BPF): return true;
        default: return false;
    }
}