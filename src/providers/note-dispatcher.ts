class NoteDispatcher {
    private keydownCB: ((key: string) => void)[];
    private keyupCB: (() => void)[];
    private MIDIdownCB: ((f: number) => void)[];
    private MIDIupCB: (() => void)[];
    private playing: string | number;
    private MIDI: boolean;
    constructor() {
        this.keydownCB = [];
        this.keyupCB = [];
        this.MIDIdownCB = [];
        this.MIDIupCB = [];
        document.addEventListener('keypress', e => this.handleKeyDown(e.key))
        document.addEventListener('keyup', e => this.handleKeyUp(e.key))
        // this.MIDI = navigator.requestMIDIAccess();
        this.MIDI = navigator["requestMIDIAccess"]()
            .then(midiAccess => {
                // Get lists of available MIDI controllers
                const inputs = midiAccess.inputs.values();

                const inp = inputs.next().value;
                inp && (inp.onmidimessage = this.handleMIDIMessage)

                midiAccess.onstatechange = function (e) {
                    const inp = inputs.next().value;
                    inp && (inp.onmidimessage = this.handleMIDIMessage);
                    // Print information about the (dis)connected MIDI controller
                    console.log(e.port.name, e.port.manufacturer, e.port.state);

                };
            })
    }

    handleMIDIMessage = midiMessage => {
        const type = midiMessage.data[0];
        const note = midiMessage.data[1];
        const velocity = midiMessage.data[2];

        if (type === 144 && velocity !== 0) {
            this.handleMIDIDown(note);
        } else if (type === 128) {
            this.handleMIDIUp(note);
        } else if (type === 144 && velocity === 0) {
            this.handleMIDIUp(note);
        }

    }

    onKeyPress = (cb: (key: string) => void) => {
        if (this.keydownCB.findIndex(it => it === cb) === -1) {
            return this.keydownCB.push(cb)
        }
        return null;
    }

    onKeyUp = (cb: () => void) => {
        if (this.keyupCB.findIndex(it => it === cb) === -1) {
            return this.keyupCB.push(cb)
        }
        return null;
    }

    onMIDIPress = (cb: (f: number) => void) => {
        if (this.MIDIdownCB.findIndex(it => it === cb) === -1) {
            return this.MIDIdownCB.push(cb)
        }
        return null;
    }

    onMIDIUp = (cb: () => void) => {
        if (this.MIDIupCB.findIndex(it => it === cb) === -1) {
            return this.MIDIupCB.push(cb)
        }
        return null;
    }

    private handleMIDIDown = (note: number) => {
        if (this.playing) return;
        this.playing = note;
        const frequency = MIDIToFrequency(note);
        this.MIDIdownCB.forEach(cb => {
            if (typeof cb === 'function') cb(frequency);
        });
    }

    private handleMIDIUp = (note: number) => {
        if (note !== this.playing) return;
        this.MIDIupCB.forEach(cb => {
            if (typeof cb === 'function') cb();
        });
        this.playing = null;
    }

    private handleKeyDown = (key: string) => {
        if (this.playing) return;
        this.playing = key;
        this.keydownCB.forEach(cb => {
            if (typeof cb === 'function') cb(key);
        });
    }

    private handleKeyUp = (key: string) => {
        if (key !== this.playing) return;
        this.keyupCB.forEach(cb => {
            if (typeof cb === 'function') cb();
        });
        this.playing = null;
    }
}

export default new NoteDispatcher();

export const MIDIToFrequency = (note: number): number => {
    // let fm = Math.pow(2,(note - 69)/12) * 440
    const fm = 27.5 * Math.pow(2, (note - 21)/12)
    console.log(fm, note);
    
    return fm;
}