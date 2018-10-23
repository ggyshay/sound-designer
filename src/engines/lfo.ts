import { isOscillatorType } from './';
import { BaseEngine } from "./base-engine";
import { fft } from 'fft-js';

export class LFO extends BaseEngine {
    public input: OscillatorNode;
    public frequency: GainNode;
    private ctx: AudioContext;
    private params: { frequency: number, type: OscillatorType, wave: PeriodicWave }
    public proxy: GainNode;

    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.params = { frequency: 1, type: 'sine', wave: null }
    }

    setup = () => {
        this.input = new OscillatorNode(this.ctx);
        this.input.frequency.value = this.params.frequency;
        if (this.params.wave) this.input.setPeriodicWave(this.params.wave);
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
        } else if (param === 'waveform' && typeof value === 'object') {
            this.changeWaveform(value);
        }
    }

    changeWaveform = (wv: Float32Array) => {
        const norm = normalizeVector(wv);
        const spectrum = fft(norm);

        const imag = new Float32Array(spectrum.length);
        const real = new Float32Array(spectrum.length);

        spectrum.forEach((element, idx) => {
            real[idx] = element[0];
            imag[idx] = element[1];
        });

        const wave = this.ctx.createPeriodicWave(real, imag);
        this.input.setPeriodicWave(wave);
    }
}

export function normalizeVector(v: Float32Array) {
    let max = v[0], min = v[0];
    for (let i = 1; i < v.length; i++) {
        if (v[i] > max) max = v[i];
        if (v[i] < min) min = v[i];
    }
    return v.map(it => (it - min) / (max - min))
}