
const MODE_BUTTON = 0;
const MODE_BUILD = 1;
const MODE_CONGRATULATIONS = 2;

const TEXT_BUTTON_START = "תלחץ עלי על מנת להמשיך";
const TEXT_INFO_BUILD = "תבנה מיטת שיזוף";
const TEXT_BUTTON_BUILD = "אישור";
const TEXT_BUTTON_END = "מזל טוב! הופיעה הודעה מלמטה";

class ImagePart {
  constructor(path, x, y) {
    this.img = loadImage(path);
    this.x = x;
    this.y = y;
    this.hasPressed = false;
  }
  
  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.img.width, this.img.height);
  }
  
  press() {
    this.hasPressed = true;
  }
  
  isInside(mx, my) {
    return this.x - this.img.width/2  <= mx &&
      mx <= this.x + this.img.width/2 &&
      this.y - this.img.height/2  <= my &&
      my <= this.y + this.img.height/2;
  }
}

var mode = 0;
var nightMode = true;

var images;
var selectedImage = -1;
var song;
var fireworks = new Fireworks();
var paragraph;
var secretMessage;

function drawButton(x, y, w, h, t) {
  fill(nightMode ? 75 : 180);
  stroke(nightMode ? 25 : 230);
  rect(x, y, 250, 40);
  fill(nightMode ? 255 : 0);
  stroke(nightMode ? 0 : 255);
  text(t, x, y);
}

function drawChair() {
  let i;
  for (i = 0; i < images.length; i++) {
    images[i].draw();
  }
}

function preload() {
  soundFormats('mp3');
  song = loadSound('assets/arabic_nokia_tone.mp3');
  songCelebration = loadSound('assets/Royalty_Free_Music.mp3');
  
  loadFont('assets/EzraSil-Po0B.ttf');
  
  images = [
    new ImagePart('assets/ChairLeg3.png', 50, 50),
    new ImagePart('assets/ChairLeg2.png', 50, 50),
    new ImagePart('assets/ChairLeg1.png', 50, 50),
    new ImagePart('assets/ChairSit.png', 50, 50),
    new ImagePart('assets/ChairBack2.png', 50, 50)
  ];
  
  secretMessage = loadStrings('assets/SecretMessage.txt');
}

function setup() {
  let canvas = createCanvas(640, 400);
  //canvas.position(0, 0);
  rectMode(CENTER);
  
  textAlign(CENTER);
  textSize(24);
  
  song.setLoop(true);
  song.setVolume(0.2);
  songCelebration.setVolume(0.2);
  
  paragraph = createP("");
  paragraph.attribute("class", "centerBox");
  paragraph.attribute("id", "secretMessage");
}

function draw() {
  clear();
  //background(nightMode ? 30 : 225);
  
  switch (mode) {
    case MODE_BUTTON:
      drawButton(width/2, height/2, 250, 40, TEXT_BUTTON_START);
      break;
    case MODE_BUILD:
      drawChair();
      drawButton(width/2, height-50, 250, 40, TEXT_BUTTON_BUILD);
      fill(nightMode ? 255 : 0);
      stroke(nightMode ? 0 : 255);
      text(TEXT_INFO_BUILD, width/2, 50);
      break;
    case MODE_CONGRATULATIONS:
      drawChair();
      if (frameCount % 8 == 0) {
        fireworks.spawn(random(width), height);
      }
      fireworks.step();
      
      fill(255);
      text(TEXT_BUTTON_END, width/2, height/2);
      
      break;
  }
}

function mousePressed() {
  switch (mode) {
    case MODE_BUTTON:
      if (width/2 - 125 <= mouseX && mouseX <= width/2 + 125  &&
          height/2 - 25 <= mouseY && mouseY <= height/2 + 25) {
            mode++;
            song.play();
          }
      break;
    case MODE_BUILD:
      if (width/2 - 125 <= mouseX &&
          mouseX <= width/2 + 125 &&
          height-50 - 20 <= mouseY &&
          mouseY <= height-50 + 20) {
        
        let nextMode = true;
        let i;
        for (i = 0; i < images.length; i++) {
          if (!images[i].hasPressed) {
            nextMode = false;
          }
        }
        if (nextMode) {
          mode++;
          song.stop();
          songCelebration.play();
          paragraph.html(secretMessage);
        }
      }
      else {
        let distanse = -1;
        let newSelectedImage = -1;
        
        let i = 0;
        for (i = 0; i < images.length; i++) {
          let newDistance = dist(mouseX, mouseY, images[i].x, images[i].y);
          if (images[i].isInside(mouseX, mouseY)) {
            if (distanse == -1 || distanse > newDistance) {
              distanse = int(newDistance);
              newSelectedImage = i;
            }
          }
        }
        
        if (newSelectedImage != -1) {
          selectedImage = newSelectedImage;
          images[selectedImage].press();
        }
      }
      break;
  }
}

function mouseDragged() {
  if (mode == MODE_BUILD && selectedImage != -1) {
    images[selectedImage].x = mouseX;
    images[selectedImage].y = mouseY;
  }
}

function mouseReleased() {
  selectedImage = -1;
}
