export type EngineType = OscillatorNode | BiquadFilterNode | GainNode | AudioDestinationNode

export class AudioEngine {
    private type: string;
    private playing: boolean;
    private engine: EngineType;
    private ctx: AudioContext;

    constructor(ctx, type) {
        this.type = type;
        this.ctx = ctx;
        this.playing = false;
    }

    start = () => {
        debugger;
        if (this.engine && this.engine instanceof OscillatorNode) {
            this.engine.start();
            this.playing = true;
        }
    }

    stop = () => {
        if (this.engine && this.engine instanceof OscillatorNode && this.isPlaying()) {
            this.engine.stop();
            this.playing = false;
        }
    }

    setup = () => {
        this.stop();
        switch (this.type) {
            case 'Oscillator':
                this.engine = this.ctx.createOscillator();
                break;
            case 'Filter':
                this.engine = this.ctx.createBiquadFilter();
                break;
            case 'Envelope':
                this.engine = this.ctx.createGain();
                break;
            case 'Output':
                this.engine = this.ctx.destination;
                break;
        }
    }

    connect = (inEngine: AudioEngine, outParameter: string, inParameter: string) => {
        this.setup();
        debugger;
        if (outParameter === 'OutSignal' && inParameter === "InSignal") {
            this.engine.connect(inEngine.engine);
        } else if (outParameter === 'OutSignal') {
            this.engine.connect(inEngine.engine[inParameter]);
        } else if (inParameter === 'InSignal') {
            this.engine[outParameter].connect(inEngine.engine);
        } else {
            this.engine[outParameter].connect(inEngine.engine[inParameter]);
        }
        debugger;
        this.start();
    }

    isPlaying = () => {
        return this.playing
    }

    changeParam = (param: string, value: string | number) => {
        if(this.engine && this.engine[param]){
            if(typeof value === 'string'){
                this.engine[param] = value;
            } else if(typeof value === 'number'){
                this.engine[param].value = value;
            }
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