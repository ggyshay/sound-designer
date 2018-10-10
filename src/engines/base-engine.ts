export class BaseEngine {
    public input: GainNode | OscillatorNode | BiquadFilterNode;

    start = (time?: number) => this.input instanceof OscillatorNode && this.input.start(time)
    stop = () => this.input instanceof OscillatorNode && this.input.stop()

    connect(destinationNode: AudioNode, output?: number, input?: number): AudioNode;
    connect(destinationParam: AudioParam, output?: number): void;
    connect(destination: any, output?: number, input?: number): any {
        console.log(destination);
        
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
        this.input.disconnect(destination, output, input);
    }

    // changeParam = (param: string, value: string|number):void => {
    //     throw new Error('changeParam not implemented by sub class');
    // }
}