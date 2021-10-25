const MAX_ITERATIONS = 100;

let minA = -2;
let maxA = 1;
let minB = -1;
let maxB = 1;

let render;

let zoomPoint;
let zoomFactor = 0.005;

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
  zoomPoint = createVector(-0.10109636384562, 0.956286511080914);
}

function draw() {
  clear();
  fill(128);
  text("FPS: " + round(frameRate()*10)/10 + " " + round(minA*1000)/1000 + " " + round(maxA*1000)/1000 + " " + round(minB*1000)/1000 + " " + round(maxB*1000)/1000, 5, 20);
  
  //Set zoom point as origin
  minA -= zoomPoint.x;
  maxA -= zoomPoint.x;
  minB += zoomPoint.y;
  maxB += zoomPoint.y;
  //Scale by zoom factor
  minA += abs(minA)*zoomFactor;
  maxA -= abs(maxA)*zoomFactor;
  minB += abs(minB)*zoomFactor;
  maxB -= abs(maxB)*zoomFactor;
  //Retranslate back
  minA += zoomPoint.x;
  maxA += zoomPoint.x;
  minB -= zoomPoint.y;
  maxB -= zoomPoint.y;
  render(minA, maxA, minB, maxB, 100);
}
