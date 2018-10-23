The sound designer is a web tool for designing custom sounds based on the WebAudio API.
There are currently 6 blocks that can be used.

## Blocks
- Oscillator
- Filter
- Envelope
- Piano Input
- Fixed Input
- Low Frequency Oscillator (LFO)

### Oscillator
The oscillator is built on top of OscillatorNode from the web audio API. It has one input and one output. The output is the signal and the input is the frequency parameter. To hear how it sounds just drag the input to the output of the system. You can select between 4 waveforms sine, square, sawtooth and triangle. The frequency of the wave can be set statically by the fixed input node or using an piano input node. If you want to add movement to it, use a LFO to modulate the frequency.

### Filter
The filter is built on top of the BiquadFilterNode from the WebAudio API. It consists of 3 different filter types: Low Pass, High Pass and Band Pass. The filter card has 3 inputs: Signal, cutoff frequency and Q (quality factor) and one output, the filtered signal.It is better understood by putting a oscillator with a square wave attatched to its input and playing with the cutoff frequency, Q and filter types. A oscillator can be attatched to the frequency and the Q.

### Envelope