let minA = -2;
let maxA = 1;
let minB = -1;
let maxB = 1;

let render;

let zoomFactor;
let maxIter;

let movePoint = -1;

function setup() {
  render = new GPU().createKernel(function(minA, maxA, minB, maxB, maxIter) {
    this.color(0, 0, 0, 1);
    let ca = minA+(maxA-minA)*this.thread.x/this.constants.w;
    let cb = minB+(maxB-minB)*(this.constants.h-this.thread.y)/this.constants.h;
    let za = 0;
    let zb = 0;
    for(let n = 0; n<maxIter; n++){
      //z = z^2 + c = (a+ib)^2 + c = a^2 - b^2 + 2abi + c
      let aa = za**2-zb**2;
      let bb = 2*za*zb;
      za = aa + ca;
      zb = bb + cb;
       
      //Not in Mandelbrot set if |z| > 2
      if(za**2+zb**2 > 4){
        this.color(n/maxIter, n/maxIter, n/maxIter, 1);
      }
    }
  }).setOutput([windowWidth, windowHeight]).setConstants({w: windowWidth, h: windowHeight}).setGraphical(true);
  
  const canvas = render.canvas;
  document.getElementsByTagName('body')[0].appendChild(canvas);
  canvas.style.position = "absolute";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = -1;
  
  createCanvas(windowWidth, windowHeight);
  
  zoomFactor = createSlider(-10, 10, 5);
  zoomFactor.position(75, height-20);
  maxIter = createSlider(2, 1000, 100);
  maxIter.position(322, height-20);
}

function draw() {
  clear();
  fill(255);
  text("Zoom Factor", 5, height-6);
  text(zoomFactor.value()/1000, 210, height-6);
  text("Max Iterations", 245, height-6);
  text(maxIter.value(), 456, height-6);
  
  if(movePoint == -1) zoomAt(createVector(-0.10109636384562, 0.956286511080914), zoomFactor.value()/1000);
  render(minA, maxA, minB, maxB, maxIter.value());
}

function mouseWheel(e){
  zoomAt(createVector(map(mouseX, 0, width, minA, maxA), map(height-mouseY, 0, height, minB, maxB)), e.delta > 0 ? 0.005 : -0.005); 
}

function mousePressed(){
  if(mouseY < height-35) movePoint = createVector(map(mouseX, 0, width, minA, maxA), map(height-mouseY, 0, height, minB, maxB));
}

function mouseReleased(){
  movePoint = -1; 
}

function mouseDragged(){
  if(movePoint == -1) return;
  let delta = p5.Vector.sub(createVector(map(mouseX, 0, width, minA, maxA), map(height-mouseY, 0, height, minB, maxB)), movePoint);
  minA -= delta.x;
  maxA -= delta.x;
  minB += delta.y;
  maxB += delta.y;
  movePoint = createVector(map(mouseX, 0, width, minA, maxA), map(height-mouseY, 0, height, minB, maxB));
}

function zoomAt(zoomPoint, zoomFactor){
  //Set zoom point as origin
  minA -= zoomPoint.x;
  maxA -= zoomPoint.x;
  minB += zoomPoint.y;
  maxB += zoomPoint.y;
  //Scale by zoom factor
  minA += abs(minA)*zoomFactor;
  maxA -= maxA*zoomFactor;
  minB += abs(minB)*zoomFactor;
  maxB -= maxB*zoomFactor;
  //Retranslate back
  minA += zoomPoint.x;
  maxA += zoomPoint.x;
  minB -= zoomPoint.y;
  maxB -= zoomPoint.y;
}
