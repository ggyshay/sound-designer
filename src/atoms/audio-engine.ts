import { Envelope, Filter, Input, LFO, Oscillator } from "src/engines";
import { FixedInput } from "src/engines/fixed-input";


export type EngineType = Oscillator | Filter | Envelope | AudioDestinationNode | Input | FixedInput | LFO;

export class AudioEngine {
    private type: string;
    private playing: boolean;
    private engine: EngineType;
    private ctx: AudioContext;

    constructor(ctx, type) {
        this.type = type;
        this.ctx = ctx;
        this.playing = false;

        switch (type) {
            case EngineTypeStrings.oscillator:
                this.engine = new Oscillator(this.ctx);
                break;
            case EngineTypeStrings.filter:
                this.engine = new Filter(this.ctx);
                break;
            case EngineTypeStrings.envelope:
                this.engine = new Envelope(this.ctx)
                break;
            case EngineTypeStrings.input:
                this.engine = new Input(this.ctx)
                break;
            case EngineTypeStrings.fixedInput:
                this.engine = new FixedInput(this.ctx);
                break;
            case EngineTypeStrings.LFO:
                this.engine = new LFO(this.ctx);
                break;
            case EngineTypeStrings.output:
                this.engine = this.ctx.destination;
                break;
            default: throw new Error(`Invalid engine type, ${this.type} string for audio engine creation`);

        }
    }

    start = (time?: number) => {
        if (!this.engine) return;
        if ((this.engine instanceof Oscillator || this.engine instanceof Envelope || this.engine instanceof LFO) && !this.playing) {
            this.engine.start(time || 0);
            this.playing = true;
        }
    }

    stop = () => {
        if (this.engine && (this.engine instanceof Oscillator || this.engine instanceof LFO) && this.isPlaying()) {
            this.engine.stop();
            this.playing = false;
        }
    }

    setup = () => {
        this.stop();
        this.playing = false;

        if (this.engine instanceof Oscillator || this.engine instanceof Filter ||
            this.engine instanceof Envelope || this.engine instanceof LFO) {
            this.engine.setup();
        } else {
            switch (this.type) {
                case EngineTypeStrings.output:
                    this.engine = this.ctx.destination;
                    break;
            }
        }
    }
    connect(inEngine: AudioEngine, outParameter: string, inParameter: string) {
        if (inEngine.engine instanceof Oscillator && this.type === EngineTypeStrings.input) {
            this.engine.connect(inEngine.engine.proxy);
            return;
        } else if (inEngine.engine instanceof Oscillator && this.engine instanceof FixedInput) {
            inEngine.engine.input.frequency.value = this.engine.input.offset.value;
            return;
        }

        if (outParameter === SignalTypes.outSignal && inParameter === SignalTypes.inSignal) {
            if (inEngine.engine instanceof Oscillator || inEngine.engine instanceof Filter || inEngine.engine instanceof Envelope) {
                this.engine.connect(inEngine.engine.input);
            } else if (inEngine.engine instanceof AudioDestinationNode) {
                this.engine.connect(inEngine.engine);
            }
        } else if (outParameter === SignalTypes.outSignal) {
            this.engine.connect(inEngine.engine[inParameter]);
        } else if (inParameter === SignalTypes.inSignal) {
            this.engine[outParameter].connect(inEngine.engine);
        } else {
            this.engine[outParameter].connect(inEngine.engine[inParameter]);
        }
    }

    disconnect = (inEngine?: AudioEngine, outParameter?: string, inParameter?: string) => {
        if (!inEngine) {
            this.engine.disconnect();
            return;
        }

        if (outParameter === SignalTypes.outSignal && inParameter === SignalTypes.inSignal) {

            if (inEngine.engine instanceof Oscillator || inEngine.engine instanceof Filter || inEngine.engine instanceof Envelope) {
                this.engine.disconnect(inEngine.engine.input)
            } else if (inEngine.engine instanceof AudioDestinationNode) {
                this.engine.disconnect(inEngine.engine);
            }

        } else if (outParameter === SignalTypes.outSignal) {
            this.engine.disconnect(inEngine.engine[inParameter]);
        } else if (inParameter === SignalTypes.inSignal) {
            this.engine[outParameter].disconnect(inEngine.engine);
        } else {
            this.engine[outParameter].disconnect(inEngine.engine[inParameter]);
        }
    }

    isPlaying = () => {
        return this.playing
    }

    changeParam = (param: string, value: string | number) => {
        if (!this.engine) { return }
        if (this.engine instanceof Envelope && typeof value === 'number') {
            this.engine.changeParam(param, value / 1000);
        } else if (this.engine instanceof Oscillator || this.engine instanceof Filter || this.engine instanceof FixedInput || this.engine instanceof LFO) {
            this.engine.changeParam(param, value)
        }
    }

    getFrequencyResponse = (inputFrequencies) => {
        if (!(this.engine instanceof Filter)) return;
        const magResponse = new Float32Array(inputFrequencies.length);
        const phaseResponse = new Float32Array(inputFrequencies.length);
        this.engine.input.getFrequencyResponse(inputFrequencies, magResponse, phaseResponse);
        return magResponse.filter(v => !isNaN(v));
    }

    setNodeProviderRef = nc => {
        if (this.engine instanceof Input || this.engine instanceof FixedInput) {
            this.engine.setNodeProviderRef(nc);
        }
    }
}

export enum FilterTypes {
    HPF = 'highpass',
    LPF = 'lowpass',
    BPF = 'bandpass'
}
export enum OscillatorTypes {
    sine = 'sine',
    saw = 'sawtooth',
    triangle = 'triangle',
    square = 'square'
}

export enum EngineTypeStrings {
    oscillator = 'Oscillator',
    filter = 'Filter',
    envelope = 'Envelope',
    output = 'Output',
    input = 'Input',
    fixedInput = 'Fixed-Input',
    LFO = 'LFO',
}

export enum SignalTypes {
    inSignal = 'InSignal',
    outSignal = 'OutSignal',
}