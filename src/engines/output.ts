import { BaseEngine } from './';
import { Recorder } from './recorder';

export class Output extends BaseEngine {
    public input: AudioDestinationNode;
    public recorder: MediaStreamAudioDestinationNode;
    private ctx: AudioContext;
    private _recorder: Recorder;
    private params: { rec: boolean }

    constructor(ctx: AudioContext) {
        super();
        this.ctx = ctx;
        this.preSetup();
        this.setup();

    }

    preSetup = () => {
        console.log('presetup');
        
        this.params = { rec: false };
        this.recorder = this.ctx.createMediaStreamDestination();
        this._recorder = new Recorder(this.recorder);
    }
    
    setup = () => {
        this.input = this.ctx.destination;
    }

    changeParam = (param: string, value: string | number) => {
        console.log(value);

        this.params.rec = (typeof value === 'string' && value === 'recording');
        if (this.params.rec) {
            this.startRecording();
        } else {
            this.stopRecording();
        }

    }

    startRecording = () => this._recorder.startRecording();
    stopRecording = () => this._recorder.stopRecording();
}