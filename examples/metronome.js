let isPlaying = false;      // Are we currently playing?
let startTime;              // The start time of the entire sequence.
let current16thNote;        // What note is currently last scheduled?
let tempo = 120.0;          // tempo (in beats per minute)
let lookahead = 25.0;       // How frequently to call scheduling function
                            //(in milliseconds)
let scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps
                            // with next interval (in case the timer is late)
let nextNoteTime = 0.0;     // when the next note is due.
let noteLength = 0.05;      // length of "beep" (in seconds)
let canvas,                 // the canvas element
    canvasContext;          // canvasContext is the canvas' context 2D
let last16thNoteDrawn = -1; // the last "box" we drew on the screen
let notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
let timerWorker = null;     // The Web Worker used to fire timer messages


// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
// window.requestAnimFrame = (function(){
//     return  window.requestAnimationFrame ||
//     window.webkitRequestAnimationFrame ||
//     window.mozRequestAnimationFrame ||
//     window.oRequestAnimationFrame ||
//     window.msRequestAnimationFrame ||
//     function( callback ){
//         window.setTimeout(callback, 1000 / 60);
//     };
// })();

function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT
                                          // tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote == 16) {
        current16thNote = 0;
    }
}

function scheduleNote( beatNumber, time ) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );

    // create an oscillator
    var osc = audioContext.createOscillator();
    osc.connect( audioContext.destination );
    if (beatNumber % 16 === 0)    // beat 0 == high pitch
        osc.frequency.value = 880.0;
    else if (beatNumber % 4 === 0 )    // quarter notes = medium pitch
        osc.frequency.value = 440.0;
    else                        // other 16th notes = low pitch
        osc.frequency.value = 220.0;

    osc.start( time );
    osc.stop( time + noteLength );
}

function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime );
        nextNote();
    }
}

function play() {
    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
        audioContext.resume()
        current16thNote = 0;
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
        audioContext.suspend()
    }
}

function draw() {
    var currentNote = last16thNoteDrawn;
    var currentTime = audioContext.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        currentNote = notesInQueue[0].note;
        notesInQueue.splice(0,1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (last16thNoteDrawn != currentNote) {
        var x = Math.floor( canvas.width / 18 );
        canvasContext.clearRect(0,0,canvas.width, canvas.height);
        for (var i=0; i<16; i++) {
            canvasContext.fillStyle = ( currentNote == i ) ?
                ((currentNote%4 === 0)?"red":"blue") : "black";
            canvasContext.fillRect( x * (i+1), x, x/2, x/2 );
        }
        last16thNoteDrawn = currentNote;
    }

    // set up to draw again
    window.requestAnimationFrame(draw);
}

function init(){
    var container = document.createElement( 'div' );

    container.className = "container";
    canvas = document.createElement( 'canvas' );
    canvasContext = canvas.getContext( '2d' );
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild( container );
    container.appendChild(canvas);
    canvasContext.strokeStyle = "#ffffff";
    canvasContext.lineWidth = 2;

    audioContext = new AudioContext();

    // if we wanted to load audio files, etc., this is where we should do it.

    window.requestAnimationFrame(draw);    // start the drawing loop.

    timerWorker = new Worker("metronomeworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
            // console.log("tick!");
            scheduler();
        }
        else {
          console.log("message: " + e.data);
        }
    };
    timerWorker.postMessage({"interval":lookahead});
}

window.addEventListener("load", init );
