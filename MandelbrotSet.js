const MAX_ITERATIONS = 100;

let minX = -2;
let maxX = 1;
let minY = -1;
let maxY = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
}


function draw() {
  background(0);
  loadPixels();
  for(let i = 0; i<width; i++){
   for(let j = 0; j<height; j++){
     let ca = map(i, 0, width, minX, maxX);
     let cb = map(j, 0, height, minY, maxY);

     let za = 0;
     let zb = 0;
     for(let n = 0; n<MAX_ITERATIONS; n++){
       //z = z^2 + c = (a+ib)^2 + c = a^2 - b^2 + 2abi + c
       aa = za**2-zb**2;
       bb = 2*za*zb;
       za = aa + ca;
       zb = bb + cb;
       
       //Not in Mandelbrot set if |z| > 2
       if(za**2+zb**2 > 4){
         set(i, j, map(n, 0, MAX_ITERATIONS, 0, 255));
         break;
       }
     }
   }
  }
  updatePixels();
  
  fill(255);
  text("FPS: " + round(frameRate()*10)/10, 5, 20);
}
