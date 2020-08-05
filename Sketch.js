
const MODE_BUTTON = 0;
const MODE_BUILD = 1;
const MODE_CONGRATULATIONS = 2;
const MODE_TEXT = 3;

const TEXT_BUTTON_START = "תלחץ עלי על מנת להמשיך";
const TEXT_INFO_BUILD = "תבנה מיטת שיזוף";
const TEXT_BUTTON_BUILD = "אישור";

class ImagePart {
  constructor(path, x, y) {
    this.img = loadImage(path);
    this.x = x;
    this.y = y;
    this.hasPressed = false;
    
  }
  
  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.img.width/5, this.img.height/5);
  }
  
  press() {
    this.hasPressed = true;
  }
  
  isInside(mx, my) {
    return this.x - this.img.width/10  <= mx &&
      mx <= this.x + this.img.width/10 &&
      this.y - this.img.height/10  <= my &&
      my <= this.y + this.img.height/10;
  }
}

var mode = MODE_BUTTON;
var nightMode = true;

var images;
var selectedImage = -1;

function drawButton(x, y, w, h, t) {
  fill(nightMode ? 75 : 180);
  stroke(nightMode ? 25 : 230);
  rect(x, y, 250, 40);
  fill(nightMode ? 255 : 0);
  stroke(nightMode ? 0 : 255);
  text(t, x, y);
}

function setup() {
  createCanvas(640, 400);
  rectMode(CENTER);
  
  loadFont('assets/EzraSil-Po0B.ttf');
  
  textAlign(CENTER);
  textSize(24);
  
  images = [
    new ImagePart('assets/ChairLeg3.png', 50, 50),
    new ImagePart('assets/ChairLeg2.png', 50, 50),
    new ImagePart('assets/ChairLeg1.png', 50, 50),
    new ImagePart('assets/ChairSit.png', 50, 50),
    new ImagePart('assets/ChairBack.png', 50, 50)
  ];
}

function draw() {
  
  background(nightMode ? 0 : 255);
  
  switch (mode) {
    case MODE_BUTTON:
      drawButton(width/2, height/2, 250, 40, TEXT_BUTTON_START);
      break;
    case MODE_BUILD:
      let i;
      for (i = 0; i < images.length; i++) {
        images[i].draw();
      }
      drawButton(width/2, height-50, 250, 40, TEXT_BUTTON_BUILD);
      fill(nightMode ? 255 : 0);
      stroke(nightMode ? 0 : 255);
      text(TEXT_INFO_BUILD, width/2, 50);
      break;
  }
}

function mousePressed() {
  switch (mode) {
    case MODE_BUTTON:
      if (width/2 - 125 <= mouseX && mouseX <= width/2 + 125  &&
          height/2 - 25 <= mouseY && mouseY <= height/2 + 25) {
            mode++;
          }
      break;
    case MODE_BUILD:
      if (width/2 - 125 <= mouseX && mouseX <= width/2 + 125  &&
          height-50 - 20 <= mouseY && mouseY <= height-50 + 20) {
            
            let nextMode = true;
            let i;
            for (i = 0; i < images.length; i++)
            if (!images[i].hasPressed)
              nextMode = false;
            
            if (nextMode)
              mode++;
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
