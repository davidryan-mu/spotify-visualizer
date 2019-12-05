import p5 from "p5";

export default function sketch(p) {
    let loudness = 0;
    let isPlaying = true;
    var backgroundColor;
    var c;

    // :: Beat Detect Variables
    // how many draw loop frames before the beatCutoff starts to decay
    // so that another beat can be triggered.
    // frameRate() is usually around 60 frames per second,
    // so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
    // we wont respond to every beat.
    var beatHoldFrames = 30;

    // what amplitude level can trigger a beat?
    var beatThreshold = 0.05; 

    // When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
    // Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
    var beatCutoff = 0;
    var beatDecayRate = 0.98; // how fast does beat cutoff decay?
    var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

    var prevLevels = new Array(60);

  p.setup = function() {
        c = p.createCanvas(p.windowWidth, p.windowHeight);
        c.position(0, 0);
        c.style('z-index', '-1');
        p.noStroke();
        p.rectMode(p.CENTER);
        backgroundColor = p.color( p.random(0,255), p.random(0,255), p.random(0,255) );
        p.frameRate(50);
  }

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
      if(props.loudness || props.isPlaying) {
        loudness = (props.loudness + 25) / 60;
        isPlaying = props.isPlaying;
      }
  }
  
  p.draw = function() {
    p.background(backgroundColor);

    detectBeat(loudness);
  
    // rectangle variables
    var spacing = 5;
    var w = p.width/ (prevLevels.length * spacing);
  
    var minHeight = 2;
    if(isPlaying == false) {
        prevLevels.push(0);
    } else {
        prevLevels.push(loudness);
    }
  
    // add new level to end of array
  
    // remove first item in array
    prevLevels.splice(0, 1);
  
    // loop through all the previous levels
    for (var i = 0; i < prevLevels.length; i++) {
  
      var x = p.map(i, prevLevels.length, 0, p.width/2, p.width);
      var h = p.map(prevLevels[i], 0, 0.5, minHeight, p.height);
  
      var hueValue = p.map(h, minHeight, p.height, 200, 255);
  
      p.fill(hueValue, 255, 255);
  
      p.rect(x, p.height/2, w, h);
      p.rect(p.width - x, p.height/2, w, h);
    }
  }

  function detectBeat(level) {
    if (level  > beatCutoff && level > beatThreshold){
      onBeat();
      beatCutoff = level *1.2;
      framesSinceLastBeat = 0;
    } else{
      if (framesSinceLastBeat <= beatHoldFrames){
        framesSinceLastBeat ++;
      }
      else{
        beatCutoff *= beatDecayRate;
        beatCutoff = Math.max(beatCutoff, beatThreshold);
      }
    }
  }

  function onBeat() {
    if(isPlaying)
      backgroundColor = p.color( p.random(0,255), p.random(0,255), p.random(0,255) );
  }
  
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
  }
}