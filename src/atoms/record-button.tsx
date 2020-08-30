import * as React from 'react'
import './record-button.css'
import { Recorder } from 'src/engines/recorder';

export class RecordButton extends React.Component<any, any> {
    private recorder: Recorder;

    constructor(props) {
        super(props);
        this.state = {
            recording: false
        }
        this.recorder = new Recorder(props.ctx);
    }

    render() {

        return !this.state.recording ? (
            <div className='record-button-initial' onClick={this.handleStart}>

            </div>
        ) :
            (
                <div className='record-button-initial' onClick={this.handleStop}>

                </div>
            )
    }

    handleStart = (e) => {
        this.recorder.startRecording();
        this.setState({recording: true})
    }

    handleStop = (e) => {
        this.recorder.stopRecording();
        this.setState({recording: false})
    }
}