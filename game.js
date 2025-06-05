let snake;
let rez = 100;
let foods = [];
const NUM_FOOD = 5;
let w;
let h;
let foodImg;
let headImg;
let bodyImg;
let premioImg;
let frutasComidas = 0;
let juegoFinalizado = false;
let juegoIniciado = false;
let pantallaInicio;
let mostrarReintentar = false;
let fondo2;
let juegoX = 2;
let juegoY = 2;
let juegoW;
let juegoH;

function preload() {
  foodImg = loadImage('imgs/fresa.png');
  headImg = loadImage('imgs/gusano_cabeza.png');
  bodyImg = loadImage('imgs/gusano_cuerpo.png');
  premioImg = loadImage('imgs/premio.png');
  pantallaInicio = loadImage('imgs/pantalla_inicio.png');
  fondo2 = loadImage('imgs/fondo2.png');
}

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

function setup() {
  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent('canvas-wrapper');
  w = floor(width / rez);
  juegoW = w - 4;
  juegoH = h - 4;
  h = floor(height / rez);
  frameRate(8);
  snake = new Snake();
  generateFoods();

  if (!juegoIniciado) noLoop(); // ← importante
}

function generateFoods() {
  foods = [];
  for (let i = 0; i < NUM_FOOD; i++) {
    addFood();
  }
}

function addFood() {
  let x = floor(random(w));
  let y = floor(random(h));
  foods.push(createVector(x, y));
}

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW: snake.setDir(-1, 0); break;
    case RIGHT_ARROW: snake.setDir(1, 0); break;
    case DOWN_ARROW: snake.setDir(0, 1); break;
    case UP_ARROW: snake.setDir(0, -1); break;
  }
}

function draw() {
  scale(rez);

  if (!juegoIniciado) {
    image(pantallaInicio, 0, 0, width / rez, height / rez);
    return;
  }

  image(fondo2, 0, 0, width / rez, height / rez);

  snake.update();
  snake.show();

  let pulse = 0.75 + 0.25 * sin(frameCount * 0.2);

  
  for (let i = foods.length - 1; i >= 0; i--) {
    let f = foods[i];
    if (f.x < juegoX || f.y < juegoY || f.x >= juegoX + juegoW || f.y >= juegoY + juegoH) continue;
    if (f.x < juegoX || f.y < juegoY || f.x >= juegoX + juegoW || f.y >= juegoY + juegoH) continue;

    image(foodImg, f.x + (1 - pulse) / 2, f.y + (1 - pulse) / 2, pulse, pulse);

    if (snake.eat(f)) {
      frutasComidas++;
      foods.splice(i, 1);
      if (frutasComidas < 5) {
        addFood();
      } else {
        juegoFinalizado = true;
        noLoop();
      }
    }
  }

fill(0);
textSize(0.6);
textAlign(LEFT, TOP);
textFont('sans-serif');  // o "Arial", "Helvetica", etc.
textStyle(BOLD);
text(`Fresas: ${frutasComidas}/5`, 0.8, 1);

  if (snake.endGame()) {
    print("END GAME");
    mostrarReintentar = true;
    noLoop();
  }

  if (mostrarReintentar) {
    fill('#d32318');
   stroke('#d32318');
strokeWeight(0.2); // grosor
    rectMode(CENTER);
    rect(w / 2, h / 2, 6, 2, 0.5);
    fill('#fff');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(1);
    text("Reintentar", w / 2, h / 2);
  }

if (juegoFinalizado) {
  resetMatrix(); // ← Esta línea es clave
  imageMode(CORNER);
  image(premioImg, 0, 0, width, height);
}
}

function mousePressed() {
  if (mostrarReintentar) {
    let x = mouseX / rez;
    let y = mouseY / rez;
    if (x > w/2 - 3 && x < w/2 + 3 && y > h/2 - 1 && y < h/2 + 1) {
      reiniciarJuego();
      return;
    }
  }
  if (!juegoIniciado) {
    let x = mouseX / rez;
    let y = mouseY / rez;
    if (x > 6 && x < 14 && y > 5 && y < 7) {
      juegoIniciado = true;
      loop();
    }
  }
}

class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));
    this.xdir = 0;
    this.ydir = 0;
    this.len = 1;
  }

  setDir(x, y) {
    if (this.body.length > 1) {
      let nextX = this.xdir;
      let nextY = this.ydir;
      if ((x === -nextX && y === 0) || (y === -nextY && x === 0)) {
        return;
      }
    }
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    head.x += this.xdir;
    head.y += this.ydir;
    this.body.push(head);

    while (this.body.length > this.len) {
      this.body.shift();
    }
  }

  grow() {
    this.len++;
  }

  endGame() {
    let head = this.body[this.body.length - 1];
    if (head.x < juegoX || head.y < juegoY || head.x >= juegoX + juegoW || head.y >= juegoY + juegoH) return true;
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x === head.x && part.y === head.y) return true;
    }
    return head.x < 0 || head.y < 0 || head.x >= w || head.y >= h;
  }

  eat(pos) {
    let head = this.body[this.body.length - 1];
    if (head.x < juegoX || head.y < juegoY || head.x >= juegoX + juegoW || head.y >= juegoY + juegoH) return true;
    if (head.x === pos.x && head.y === pos.y) {
      this.grow();
      return true;
    }
    return false;
  }

  show() {
    for (let i = 0; i < this.body.length; i++) {
      let seg = this.body[i];
      if (i === this.body.length - 1) {
        image(headImg, seg.x - 0.1, seg.y - 0.1, 1.5, 1.5);
      } else {
        image(bodyImg, seg.x - 0.05, seg.y - 0.05, 1.1, 1.1);
      }
    }
  }
}

function reiniciarJuego() {
  frutasComidas = 0;
  mostrarReintentar = false;
  juegoFinalizado = false;
  snake = new Snake();
  generateFoods();
  loop();
}