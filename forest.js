const stalks = [];
const stalkCount = 140;
let walkerX = 0;
let targetX = 0;
let noiseOffset = 0;

class Stalk {
  constructor(x) {
    this.baseX = x;
    this.height = random(height * 0.4, height * 1.2);
    this.width = random(2, 6);
    this.offset = random(1000);
    this.speed = random(0.001, 0.005);
    this.depth = random(0.2, 1);
    this.color = color(14, 60, map(this.depth, 0.2, 1, 40, 120));
  }

  draw() {
    const sway = noise(this.offset + noiseOffset) * 40 - 20;
    const distance = abs((this.baseX + sway) - walkerX);
    const bend = map(distance, 0, width * 0.35, 80, 0, true);
    const clearing = constrain(map(distance, 0, width * 0.25, 40, 0), 0, 40);
    const xPos = this.baseX + sway + (this.baseX < walkerX ? -bend : bend);

    push();
    translate(xPos, height);
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), map(this.depth, 0.2, 1, 60, 180));

    const grad = drawingContext.createLinearGradient(0, 0, 0, -this.height);
    const base = color(5, 30, 12, 200 * this.depth);
    grad.addColorStop(0, `rgba(${red(base)}, ${green(base)}, ${blue(base)}, ${alpha(base) / 255})`);
    grad.addColorStop(1, `rgba(${red(this.color)}, ${green(this.color)}, ${blue(this.color)}, ${map(this.depth, 0.2, 1, 0.1, 0.4)})`);
    drawingContext.fillStyle = grad;

    const lineWidth = this.width * (1 + (40 - clearing) / 60);
    rect(-lineWidth / 2, -this.height, lineWidth, this.height);

    const highlightAlpha = map(distance, 0, width * 0.25, 200, 0, true);
    fill(255, 255, 200, highlightAlpha);
    rect(-lineWidth / 6, -this.height, lineWidth / 3, this.height * 0.4);
    pop();
  }
}

function setup() {
  const wrapper = document.getElementById('forest-canvas-wrapper');
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(wrapper);
  colorMode(RGB);
  noStroke();
  for (let i = 0; i < stalkCount; i++) {
    const x = map(i, 0, stalkCount - 1, -width * 0.1, width * 1.1);
    stalks.push(new Stalk(x));
  }
  walkerX = width / 2;
  targetX = walkerX;
}

function draw() {
  clear();
  drawingContext.globalCompositeOperation = 'lighter';
  background(0, 0, 0, 80);
  drawingContext.globalCompositeOperation = 'source-over';

  targetX = lerp(targetX, mouseX || width / 2, 0.05);
  walkerX = lerp(walkerX, targetX, 0.05);
  noiseOffset += 0.003;

  for (let i = 0; i < stalks.length; i++) {
    push();
    const depthScale = map(stalks[i].depth, 0.2, 1, 0.4, 1);
    scale(depthScale, depthScale);
    stalks[i].draw();
    pop();
  }

  drawTrail();
}

function drawTrail() {
  const glowWidth = width * 0.15;
  const gradient = drawingContext.createLinearGradient(walkerX - glowWidth, 0, walkerX + glowWidth, 0);
  gradient.addColorStop(0, 'rgba(10, 50, 30, 0)');
  gradient.addColorStop(0.45, 'rgba(160, 255, 200, 0.15)');
  gradient.addColorStop(0.5, 'rgba(200, 255, 230, 0.5)');
  gradient.addColorStop(0.55, 'rgba(160, 255, 200, 0.15)');
  gradient.addColorStop(1, 'rgba(10, 50, 30, 0)');
  drawingContext.fillStyle = gradient;

  noStroke();
  rect(walkerX - glowWidth, 0, glowWidth * 2, height);

  drawingContext.fillStyle = 'rgba(255, 255, 230, 0.6)';
  const dashHeight = 60;
  const spacing = 45;
  for (let y = -dashHeight * 2; y < height + dashHeight; y += dashHeight + spacing) {
    rect(walkerX - 4, y, 8, dashHeight);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  stalks.length = 0;
  for (let i = 0; i < stalkCount; i++) {
    const x = map(i, 0, stalkCount - 1, -width * 0.1, width * 1.1);
    stalks.push(new Stalk(x));
  }
}
