class Renderer{
  constructor(){
    this.reqAnim()
    this.loadDraw()
  }
  stepper(){
    // console.log('st',this)
    // debugger
    var currentStep = lastStepRendered;
    var currentTime = audioContext.currentTime;
    while (queue.length && queue[0].time < currentTime) {
        //reassigns currentStep and splices the queue array
        currentStep = queue[0].step;
        queue.splice(0,1);
    }

    if (lastStepRendered != currentStep) {
        if (lastStepRendered != -1) {
          let activeButton = document.getElementById(currentStep);
          let lastButton = document.getElementById(lastStepRendered);
          activeButton.className = 'activeStep';
          this.nameAssign(lastStepRendered);
        }

        lastStepRendered = currentStep;
    }
    // set up to draw again
    this.reqAnim();
  }
  loadDraw(){
    // console.log('ld', this)
    let seqDiv = document.createElement('div');
    for (let i=0;i<16;i++){
      let button = document.createElement('button');
      button.id = i;
      seqDiv.appendChild(button);
      document.body.append(seqDiv);
      this.nameAssign(i);
    }
  }
  reqAnim(){
    window.requestAnimationFrame(this.stepper.bind(this));
  }
  nameAssign(id){
    let button = document.getElementById(id);
    (seq1[id] != null)?
    button.className = 'populatedStep':
    button.className = 'nullStep';
  }
}
