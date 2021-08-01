function Cell(){
  this.isAlive = false
  this.nextState = false
}

function makeGrid(x, y) {
  return Array.from(Array(x), () => new Array(y).fill(1));
}

let grid;
let size = 20;
let w = 400;
let h = 400;
let isPlaying = false;

function setup() {
  var canvas = createCanvas(w, h);
  canvas.parent('main');
  background(100);
  frameRate(15);
  noLoop();

  grid = makeGrid(w / size, h / size);
  for(x = 0; x < (w / size);x++){
    for(y = 0; y < (h / size);y++){
      grid[x][y] = new Cell();
      drawCell(x, y, grid[x][y].isAlive);
    }
  }
}

function draw() {
  if (isPlaying){
    updateStatus();
    grid.forEach((col, x) => {
      col.forEach((row, y) => {
        drawCell(x, y, grid[x][y].nextState);
        grid[x][y].isAlive = grid[x][y].nextState;
      });
    });
  }
}

function mousePressed() {
  if (
    mouseX >= 0 &&
    mouseY >= 0 &&
    mouseX < width &&
    mouseY < height && !isPlaying
  ) {
    x = floor(mouseX / size);
    y = floor(mouseY / size);
    grid[x][y].isAlive = !grid[x][y].isAlive;
    drawCell(x, y, grid[x][y].isAlive);
  }
}

function updateStatus() {
  grid.forEach((col, x) => {
    col.forEach((row, y) => {
      let count = countNeighbours(x, y);
      if (grid[x][y].isAlive && (count == 2 || count == 3))
        grid[x][y].nextState = true;
      else if (grid[x][y].isAlive==false && count == 3) {
        grid[x][y].nextState = true;
      } else grid[x][y].nextState = false;
    });
  });
}

function countNeighbours(x, y) {
  xoff = w / size;
  yoff = h / size;
  aliveNeighbours = 0;
  for (i = -1; i <= 1; i++) {
    for (j = -1; j <= 1; j++) {
      if (i != 0 || j != 0) {
        if (grid[(x + i + xoff) % xoff][(y + j + yoff) % yoff].isAlive) {
          aliveNeighbours++;
        }
      }
    }
  }
  return aliveNeighbours;
}

function drawCell(x, y, status) {
  if (status) fill(255);
  else fill(0);
  square(x * size + 1, y * size + 1, size-2);
}
document.getElementById("widthRange").max = Math.floor(document.querySelector('#main').clientWidth / size) -1
window.onresize = () => {
  document.getElementById("widthRange").max = Math.floor(document.querySelector('#main').clientWidth / size)-1
}

document.getElementById("apply").onclick = () => {
  w = document.getElementById("widthRange").value * size;
  h = document.getElementById("heightRange").value * size;
  setup()
};

document.getElementById("start").onclick = () => {
  isPlaying = true;
  loop();
};

document.getElementById("stop").onclick = () => {
  isPlaying = false;
  noLoop();
};
