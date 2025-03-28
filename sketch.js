let capture
let gridSize1 = 5
let gridSize2 = 7
let tSize = -1

//Color Variables for Adulthood
let rc = 252
let gc = 0
let bc = 106
let rd = 20
let gd = 20
let bd = 20

const numbers = `1234567890`

//Death Variables
let faceMesh;
let options = {
  maxFaces: 5,
  refineLandmarks: false,
  flipped: true
}
let faces = []

let cHeight

let filmCols
let filmWidth = 30

let textS;

function preload() {
  font = loadFont('digital.ttf')
  adultFont = loadFont('LexendDeca.ttf')
  faceMesh = ml5.faceMesh(options)
}

function setup() {
  background(255)
  textAlign(CENTER, CENTER)
  textOutput();
  var myCanvas = createCanvas(windowWidth, windowHeight, P2D)
  myCanvas.canvas.willReadFrequently = true;
  myCanvas.parent("canvas")
  capture = createCapture(VIDEO, {flipped: true})
  let capW = width/5
  let capH = capW * 9 /16
  capture.size(capW, capH)
  capture.hide()
  
  cHeight = height/2 - (capture.height/2) - 10
  textS = height/38
  
  noStroke()
  textAlign(CENTER)
  drawBorder()
  
  faceMesh.detectStart(capture, gotFaces)
  
  filmCols = windowWidth/(10*filmWidth)
}

function draw() {
  capture.loadPixels()
  
  let cols = (windowWidth - (capture.width * 4)) / 5;
  console.log(cols)
  
  push()
  childhood(cols, cHeight)
  pop()
  push()
  adulthood((cols * 2) + capture.width, cHeight)
  pop()
  push()
  elderHood((cols * 3) + (capture.width * 2), cHeight)
  pop()
  push()
  death((cols * 4) + (capture.width * 3), cHeight)
  pop()
}

function childhood(x, y) {
  translate(x, y)
  noStroke()
  for (let y = 0; y < capture.height; y += gridSize1) {
      for (let x = 0; x < capture.width; x += gridSize1) {
        let index = (y * capture.width + x) * 4
        let r = capture.pixels[index + 0] * 1.5
        let g = capture.pixels[index + 1] * 1.5
        let b = capture.pixels[index + 2] * 1.5
        fill(r, g, b, 4)
        rect(x, y, gridSize1, gridSize1)
      }
    }
  fill(255)
  noStroke()
  textFont(adultFont)
  textSize(textS)
  text("childhood", capture.width/2, capture.height+25)
}

function adulthood(x, y) {
  translate(x, y)
  if (rc >= 255 || rc <= 0) {
    rd *= -1
  }
  if (gc >= 255 || gc <= 0) {
    gd *= -1
  }
  if (bc >= 255 || bc <= 0) {
    bd *= -1
  }
  
  rc += rd
  gc += gd
  bc += bd
  
  fill(rc, gc, bc)
  rect(0, 0, capture.width, capture.height)
  
  for (let y = 0; y < capture.height; y += gridSize1) {
      for (let x = 0; x < capture.width; x += gridSize1) {
        let index = (y * capture.width + x) * 4
        let r = capture.pixels[index]
        let dia = map(r, 0, 255, gridSize1, -7)
        let rdia = dia * random(-2, 2)

        fill(gc, bc, rc)
        noStroke()
        circle(x, y, rdia)
        fill(bc, rc, gc)
        let xoffset = random(2)
        let yoffset = random(2)
        circle(x + xoffset, y + yoffset, rdia)
        //Tutorial for circle silhouette from https://www.youtube.com/watch?v=VYg-YdGpW1o&ab_channel=JeffThompson
      }
    }
  strokeWeight(20)
  stroke(0)
  fill(0, 0, 0, 0)
  rect(-10, -10, capture.width+20, capture.height+20)
  
  fill(255)
  noStroke()
  textFont(adultFont)
  textSize(textS)
  text("adulthood", capture.width/2, capture.height+25)
}

function elderHood(x, y) {
  translate(x, y)
  fill(255)
  rect(0, 0, capture.width, capture.height)
  for (let y = 0; y < capture.height; y += gridSize2) {
      for (let x = 0; x < capture.width; x += gridSize2) {
        let index = (y * capture.width + x) * 4
        let r = capture.pixels[index]
        let dia = map(r, 0, 255, gridSize2, -7)

        const rand = int(random(0, numbers.length-1))
        
        let appear = int(random(1, 2))
        if (appear != 2) {
          fill(0)
        }
        else {
          fill(255)
        }
        
        fill(0)
        textFont(font)
        textSize(dia + tSize)
        text(numbers[rand], x, y)
      }
    }
  fill(255)
  noStroke()
  textFont(adultFont)
  textSize(textS)
  text("elderhood", capture.width/2, capture.height+25)
}

function death(x, y) {
  translate(x, y)
  rectMode(CENTER)
  fill(255)
  tint(180, 150, 120, 160)
  image(capture, 0, 0)
  
  if (faces.length > 0) {
    let face = faces[0]
    
    let leftOuter = face.keypoints[127];
    let rightOuter = face.keypoints[356];

    let eyeDistance = dist(leftOuter.x, leftOuter.y, rightOuter.x, rightOuter.y);
    
    let keypoint = face.keypoints[168]
    
    fill("#262215")
    rect(keypoint.x, keypoint.y, eyeDistance+20, eyeDistance/2.5)
  }
  //ml5.js tutorial from https://www.youtube.com/watch?v=R5UZsIwPbJA&ab_channel=TheCodingTrain
  
  for (let i = 0; i < 1000; i++) {
    let gx = random(capture.width)
    let gy = random(capture.height)
    let gAlpha = random(10, 100)
    fill(255, 255, 255, gAlpha)
    rect(gx, gy, 1, 1)
  }
  
  strokeWeight(20)
  stroke(0)
  fill(0, 0, 0, 0)
  rect(capture.width/2, capture.height/2, capture.width+20, capture.height+20)
  
  fill(255)
  noStroke()
  textFont(adultFont)
  textSize(textS)
  text("death", capture.width/2, capture.height+25)
}

function gotFaces(results) {
  faces = results;
}

function drawBorder() {
  push()
  rectMode(CENTER)
  let border = height/2
  let borderHeight = height/2.3
  fill(0)
  rect(width/2, border, width, borderHeight)
  
  let numRects = 15 
  let spacing = width / numRects
  let rectWidth = spacing * 0.6
  let rectHeight = 35
  let yTop = border - borderHeight/2 + 40
  let yBottom = border + borderHeight/2 - rectHeight - 10;

  for (let i = 0; i < numRects; i++) {
    let x = (i * spacing + (spacing - rectWidth) / 2) + rectWidth/2
    fill(255)
    rect(x, yTop, rectWidth, rectHeight)
    rect(x, yBottom, rectWidth, rectHeight)
  }
  pop()
}