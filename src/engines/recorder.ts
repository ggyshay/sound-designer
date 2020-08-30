export class Recorder {
    public input: ConstantSourceNode;
    private chunks: BlobPart[];
    private mediaRecorder: MediaRecorder;
    private stream: MediaStreamAudioDestinationNode;

    constructor(stream: MediaStreamAudioDestinationNode) {
        this.chunks = [];
        this.stream = stream;
        if (!this.stream.stream) return;
    
        this.mediaRecorder = new MediaRecorder(this.stream.stream);
        this.mediaRecorder.onstop = this.handleEndRecording;
        this.mediaRecorder.ondataavailable = (e) => {
            this.chunks.push(e.data);
        }
    }

    stopRecording = () => {
        this.mediaRecorder.stop();
    }

    startRecording = () => {
        this.mediaRecorder.start();
        console.log(this.mediaRecorder.state);
        console.log("recorder started");
    }

    private handleEndRecording = (e) => {
        console.log("data available after MediaRecorder.stop() called.");

        var clipName = 'sound-recording';
        var blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
        this.chunks = [];
        var audioURL = URL.createObjectURL(blob);
        console.log("recorder stopped");

        var saveData = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            // a.style = "display: none";
            return function (url, fileName) {
                // var json = JSON.stringify(data),
                //     blob = new Blob([json], {type: "octet/stream"}),
                //     url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());

        saveData(audioURL, clipName);
    }
}