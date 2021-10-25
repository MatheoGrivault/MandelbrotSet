const MAX_ITERATIONS = 100;

let minX = -2;
let maxX = 1;
let minY = -1;
let maxY = 1;

let gpu;
let computePoints;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gpu = new GPU();
  computePoints = gpu.createKernel(function() {
     let ca = this.thread.x/813*3-2;
     let cb = this.thread.y/793*2-1;
     let za = 0;
     let zb = 0;
     for(let n = 0; n<100; n++){
       //z = z^2 + c = (a+ib)^2 + c = a^2 - b^2 + 2abi + c
       let aa = za**2-zb**2;
       let bb = 2*za*zb;
       za = aa + ca;
       zb = bb + cb;
       
       //Not in Mandelbrot set if |z| > 2
       if(za**2+zb**2 > 4){
         return n/100*255;
       }
     }
     return 0;
  }).setOutput([windowWidth, windowHeight]);
}

function draw() {
  let p = computePoints();
  loadPixels();
  for(let x = 0; x<width; x++){
    for(let y = 0; y<height; y++){
      set(x, y, p[y][x]); 
    }
  }
  updatePixels();
  
  fill(255);
  text("FPS: " + round(frameRate()*10)/10, 5, 20);
}
