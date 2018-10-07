import { EnvelopeNode } from "../engines/envelope";

export type EngineType = OscillatorNode | BiquadFilterNode | GainNode | AudioDestinationNode

export class AudioEngine {
    private type: string;
    private playing: boolean;
    private engine: EngineType;
    private ctx: AudioContext;
    private envParams: any;
    private oscParams: any;

    constructor(ctx, type) {
        this.type = type;
        this.ctx = ctx;
        this.playing = false;
        this.envParams = {
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0
        };
        this.oscParams = {
            type: 'sine',
            frequency: 440
        }
    }

    start = (time?: number) => {
        if (!this.engine) return;
        if (this.engine instanceof OscillatorNode && !this.playing) {
            this.engine.start(time || 0);
            this.playing = true;
        } else if (this.engine instanceof GainNode && !this.playing) {
            const { attack, decay, sustain, release } = this.envParams;
            //zero volume
            this.engine.gain.setValueAtTime(0, time || this.ctx.currentTime);
            //attack
            this.engine.gain.linearRampToValueAtTime(1, (time || this.ctx.currentTime) + attack);
            //sustain
            this.engine.gain.exponentialRampToValueAtTime(sustain || 0.0001, (time || this.ctx.currentTime) + attack + decay);
            //release
            this.engine.gain.exponentialRampToValueAtTime(0.0001, (time || this.ctx.currentTime) + attack + decay + release);
            this.engine.gain.linearRampToValueAtTime(0, (time || this.ctx.currentTime) + attack + decay + release + 0.001);

            setTimeout(() => { this.playing = false }, (time || 0) + attack + decay + release);
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
        this.playing = false;
        switch (this.type) {
            case 'Oscillator':
                this.engine = new OscillatorNode(this.ctx);
                this.engine.type = this.oscParams.type;
                this.engine.frequency.value = this.oscParams.frequency;
                break;
            case 'Filter':
                this.engine = new BiquadFilterNode(this.ctx);
                break;
            case 'Envelope':
                this.engine = new GainNode(this.ctx);
                break;
            case 'Output':
                this.engine = this.ctx.destination;
                break;
        }
    }
    connect(inEngine: AudioEngine, outParameter: string, inParameter: string) {
        // this is breaking because inEngine is sometimes an audio param:
        // overide fn to accept audioParam as parameter
        if (outParameter === 'OutSignal' && inParameter === "InSignal") {
            this.engine.connect(inEngine.engine);
        } else if (outParameter === 'OutSignal') {
            this.engine.connect(inEngine.engine[inParameter]);
        } else if (inParameter === 'InSignal') {
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
        
        if (outParameter === 'OutSignal' && inParameter === "InSignal") {
            this.engine.disconnect(inEngine.engine);
        } else if (outParameter === 'OutSignal') {
            this.engine.disconnect(inEngine.engine[inParameter]);
        } else if (inParameter === 'InSignal') {
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
        if (this.type === 'Envelope' && typeof value === 'number') {
            this.envParams[param] = value / 1000;
        } else if (this.engine[param]) {
            if (typeof value === 'string') {
                this.engine[param] = value;
                this.oscParams[param] = value;
            } else if (typeof value === 'number') {
                this.engine[param].value = value;
                this.oscParams[param] = value;
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