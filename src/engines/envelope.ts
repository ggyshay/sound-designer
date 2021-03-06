import { BaseEngine } from "./base-engine";
import noteDispatcher from "src/providers/note-dispatcher";

export class Envelope extends BaseEngine {
    public input: GainNode;
    private params: { attack: number, decay: number, sustain: number, release: number };
    private ctx: AudioContext;
    private endCB: any;

    constructor(ctx) {
        super();
        this.params = { attack: 0.005, decay: 0.050, sustain: 0.600, release: 0.050 }
        this.ctx = ctx;
        // document.addEventListener('keyup', this.release)
        noteDispatcher.onKeyUp(this.release);
        noteDispatcher.onMIDIUp(this.release)
    }

    setup = () => {
        this.input = new GainNode(this.ctx)
    }

    start = (time?: number) => {
        const { attack, decay, sustain, release } = this.params;
        //zero volume
        this.input.gain.setValueAtTime(0, time || this.ctx.currentTime);
        //attack
        this.input.gain.linearRampToValueAtTime(1, (time || this.ctx.currentTime) + attack);
        //sustain
        this.input.gain.exponentialRampToValueAtTime(sustain || 0.0001, (time || this.ctx.currentTime) + attack + decay);
    }

    release = () => {
        const { release } = this.params;
        this.input.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + release);
        this.input.gain.linearRampToValueAtTime(0, this.ctx.currentTime + release + 0.001);
        this.endCB && setTimeout(this.endCB, release);
    }

    onEnded = fn => {
        this.endCB = fn
    }

    changeParam = (param, value) => {
        if (this.params[param]) {
            this.params[param] = value
        }
    }
}