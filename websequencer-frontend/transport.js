let isPlaying = false;
lastStepRendered = -1;
let currentStep;
let bpm = 120.0;
let lookahead = 3000.0/bpm;
let nextStepTime = 0.0;
let stepLength = 6.0/bpm;
let queue = [];
let seq1 = [{note: 44},{note: 49},{note: 40},null,{note: 44},{note: 49},null,{note: 36},{note: 44},null,{note: 40},{note: 36},{note: 44},{note: 49},{note: 40},{note: 36}]
let audioContext = new AudioContext();
let schedThread = new Worker("transportWorker.js");


document.addEventListener("DOMContentLoaded", init );

function init(){
    let renderer = new Renderer();
    // if we wanted to load audio files, etc., this is where we should do it.
    schedThreader()

}

function schedThreader(){

    schedThread.onmessage = e => {
        if (e.data == "tick") {
            scheduler();
              // console.log('working',lookahead)
        } else {
          console.log(e.data);
        }
    }; schedThread.postMessage({"interval":lookahead});
}

function nextStep() {
    // Advance current step and time by a 16th note...
    var secondsPerBeat = 60.0 / bpm;    // Notice this picks up the CURRENT bpm value to calculate beat length.
    nextStepTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time
    currentStep++;    // Advance the beat number, wrap to zero
    if (currentStep == 16) {currentStep = 0;}
}

function scheduleStep( stepNumber, time ) {
    queue.push( { step: stepNumber, time: time } );
    if (seq1[stepNumber]!=null){
      stepNote = seq1[stepNumber].note - 24
      stepFreq = equalTemperament[stepNote]
      synthVoice = new Synthesizer(stepFreq,time)
  }
}

function scheduler() {
    // How far ahead to schedule audio (sec) This is calculated from
    // lookahead, and overlaps with next interval (in case the timer is late)
    let scheduleAheadTime = lookahead/250;
    // schedule events between here and next schedThread ahead time call, and then step forward
    while (nextStepTime < audioContext.currentTime + scheduleAheadTime ) {
       scheduleStep( currentStep, nextStepTime );
        nextStep();
    }
}

function play() {
    isPlaying = !isPlaying;
    if (isPlaying) { // start playing
        audioContext.resume().then(()=>{
          currentStep = 0;
          nextStepTime = audioContext.currentTime;
          schedThread.postMessage("start");
        })
        return "stop";
    } else {
        schedThread.postMessage("stop");
        return "play";
        audioContext.suspend()
    }
}
