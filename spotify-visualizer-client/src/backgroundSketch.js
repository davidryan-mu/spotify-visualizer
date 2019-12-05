import p5 from "p5";

export default function sketch(p) {
  let c;

  p.setup = function() {
        c = p.createCanvas(p.windowWidth, p.windowHeight);
        c.position(0, 0);
        c.style('z-index', '-1');
  }
  
  p.draw = function() {
    p.background(220);

    let color1 = p.color(17, 153, 142);
    let color2 = p.color(56, 239, 125);

    setGradient(0, 0, p.windowWidth, p.windowHeight, color1, color2, "Y");
  }
  
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
  }

  function setGradient(x, y, w, h, c1, c2, axis) {
    p.noFill();
    if (axis == "Y") {  // Top to bottom gradient
      for (let i = y; i <= y+h; i++) {
        var inter = p.map(i, y, y+h, 0, 1);
        var c = p.lerpColor(c1, c2, inter);
        p.stroke(c);
        p.line(x, i, x+w, i);
      }
    }  
    else if (axis == "X") {  // Left to right gradient
      for (let j = x; j <= x+w; j++) {
        var inter2 = p.map(j, x, x+w, 0, 1);
        var d = p.lerpColor(c1, c2, inter2);
        p.stroke(d);
        p.line(j, y, j, y+h);
      }
    }
  }
}
