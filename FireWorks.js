
const GRAVITY = -0.01;

class Spark {
  constructor(pos, angle, power, time, c) {
    this.ended = false;
    this.maxTime = time;
    this.time = time;
    this.c = c;
    
    this.pos = pos;
    this.vel = new p5.Vector(1.0, 0.0);
    this.vel.rotate(angle);
    this.vel.mult(power);
  }
  
  step() {
    this.time -= 1.0;
    this.pos.add(this.vel);
    this.vel.add(0.0, -GRAVITY);
    if (this.time <= 0.0) {
      this.ended = true;
    }
  }
  
  draw() {
    this.c.setAlpha(this.time/this.maxTime*255);
    fill(this.c);
    circle(this.pos.x, this.pos.y, 5.0, 5.0);
  }
  
  hasEnded() {
    return this.ended;
  }
}

class Firework {
  constructor(x, y, time, speed, sparkCount) {
    this.pos = createVector(x, y);
    this.speed = speed;
    this.exploded = false;
    this.time = time;
    this.sparkCount = sparkCount;
    this.sparks = [];
    let rgbCol = hsv2rgb(random(360.0), 1.0, 1.0);
    this.c = color(rgbCol[0]*255, rgbCol[1]*255, rgbCol[2]*255);
  }
  
  step() {
    this.pos.add(0, -this.speed);
    this.time -= 1.0;
    if (this.time <= 0.0) {
      if (!this.exploded) {
        let i;
        for (i = 0; i < this.sparkCount; i++) {
          let a = random(0.0, TWO_PI);
          let c = shuffleColor(this.c, 25.0);
          this.sparks.push(new Spark(
            this.pos.copy(), a, this.sparkCount/16.0,
            100, this.c));
        }
      }
      this.exploded = true;
    }
    
    if (!this.exploded) {
      fill(this.c);
      rect(this.pos.x, this.pos.y, this.sparkCount/2, this.sparkCount);
    }
    
    if (this.exploded) {
      let i;
      for (i = 0; i < this.sparks.length; i++) {
        this.sparks[i].step();
        this.sparks[i].draw();
      }
    }
  }
  
  hasEnded() {
    let sparksEnded = true;
    let i;
    for (i = 0; i < this.sparks.length; i++) {
      if (!this.sparks[i].hasEnded()) {
        sparksEnded = false;
        break;
      }
    }
    return this.exploded && sparksEnded;
  }
}

class Fireworks {
  
  constructor() {
    this.fireworks = [];
  }
  
  spawn(x, y) {
    let speed = random(1, 10);
    let sparks = int(random(10, 25));
    let time = 50;
    this.fireworks.push(new Firework(x, y, time, speed, sparks));
  }
  
  step() {
    let i;
    for (i = this.fireworks.length - 1; i >= 0; i--) {
      if (this.fireworks[i].hasEnded()) {
        this.fireworks.splice(i, 1);
        continue;
      }
      this.fireworks[i].step();
    }
  }
}
