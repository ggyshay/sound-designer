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
The envelope is Built on top of the GainNode of from the WebAudio API. The function of a envelope is to set the amplitude of a signal across a period of time. It has four parameters: Attack (time the signal takes to go from 0 to its maximum aplitude), decay (time signal goes from its maximum to a sustain level), sustain (the level its stays after decay) and release (time the signal takes to go from sustain to zero). The evelope card has one input (the signal) and one output(modulated signal).

### Piano Input
The piano input is a table that matches keyboard keys with frequencies. 'a' is C (262 Hz), 'w' is C# (278 Hz), so on and so forth.

### Fixed Input
Simple frequency input field. Currently can only affect Oscillator.

### Low Frequency Oscillator (LFO)
It is almost the same as the Oscillator, the difference is that the frequency is a fixed value and wave display accepts mouse inputs. That way a completely custom waveform can be drawn. It has as well a button that selects one shot mode or loop mode but it currently doesen't work. To see it working you can plug it derectly to the output(so raise the frequency to the hearable domain, 20 to 20000 Hz) or, more interessting, put it on the oscillator frequency port and play with the waveform.

## Manipulations
To hear a sound, the signal has to be connected to the output. Every connection can be deleted by selecting it(it beacomes white) and pressing delete. Even though cards can be deleted as well, the deletion is not behaving properly right now.
A ugly trigger button is placed on the screen for sound debugging, press it and every connection is renewed and oscillators are restarted. To completely clear the screen just reload (something will be done about this later).

Obs: it doesen't work on safari because of some problems with the audio contex. On chrome and firefox it apears to be fine.