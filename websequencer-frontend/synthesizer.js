let filterFreq = 120
class Synthesizer{
  constructor(freq,time){
    var osc = new OscillatorNode(audioContext);
    osc.type = 'square';
    var gainNode = audioContext.createGain();
    var filter = audioContext.createBiquadFilter();
    filter.frequency.value = filterFreq;
    filter.Q.value = 6;
    osc.connect(filter);
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)
    osc.frequency.value = freq;
    osc.start( time );
    gainNode.gain.setTargetAtTime(0.000, time, stepLength + .06);
    filter.frequency.setTargetAtTime(0.000, time, stepLength + .4);
    osc.stop( time + stepLength + 1 )
  }
}
