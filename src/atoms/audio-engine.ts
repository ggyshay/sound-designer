import { Filter, Oscillator, Envelope, Input } from "src/engines";

export type EngineType = Oscillator | Filter | Envelope | AudioDestinationNode | Input;

export class AudioEngine {
    private type: string;
    private playing: boolean;
    private engine: EngineType;
    private ctx: AudioContext;

    constructor(ctx, type) {
        this.type = type;
        this.ctx = ctx;
        this.playing = false;

        if (type === EngineTypeStrings.oscillator) { this.engine = new Oscillator(this.ctx) }
        else if (type === EngineTypeStrings.filter) { this.engine = new Filter(this.ctx) }
        else if (type === EngineTypeStrings.envelope) { this.engine = new Envelope(this.ctx) }
        else if (type === EngineTypeStrings.input) { this.engine = new Input(this.ctx) }
    }

    start = (time?: number) => {
        if (!this.engine) return;
        if ((this.engine instanceof Oscillator || this.engine instanceof Envelope) && !this.playing) {
            this.engine.start(time || 0);
            this.playing = true;
        }
    }

    stop = () => {
        if (this.engine && (this.engine instanceof Oscillator) && this.isPlaying()) {
            this.engine.stop();
            this.playing = false;
        }
    }

    setup = () => {
        this.stop();
        this.playing = false;

        if (this.engine instanceof Oscillator || this.engine instanceof Filter || this.engine instanceof Envelope) {
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
        } else if (this.engine instanceof Oscillator || this.engine instanceof Filter) {
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
        if (this.engine instanceof Input) {
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
    fixedInput = 'Fixed-Input'
}

export enum SignalTypes {
    inSignal = 'InSignal',
    outSignal = 'OutSignal',
}