export class BaseEngine {
    public input: GainNode | OscillatorNode | BiquadFilterNode | ConstantSourceNode;

    start = (time?: number) => this.input instanceof OscillatorNode && this.input.start(time)
    stop = () => this.input instanceof OscillatorNode && this.input.stop()

    public connect(destinationNode: AudioNode, output?: number, input?: number): AudioNode;
    public connect(destinationParam: AudioParam, output?: number): void;
    public connect(destination: any, output?: number, input?: number): any {
        this.input.connect(destination, output, input);
    }

    disconnect(): void;
    disconnect(output: number): void;
    disconnect(destinationNode: AudioNode): void;
    disconnect(destinationNode: AudioNode, output: number): void;
    disconnect(destinationNode: AudioNode, output: number, input: number): void;
    disconnect(destinationParam: AudioParam): void;
    disconnect(destinationParam: AudioParam, output: number): void;

    disconnect(destination?: any, output?: any, input?: any) {
        if (!destination) {
            this.input.disconnect();
        } else {
            this.input.disconnect(destination, output, input);
        }
    }
}