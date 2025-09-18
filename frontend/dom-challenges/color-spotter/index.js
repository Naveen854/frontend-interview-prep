const getRandomColors = function () {
  var ratio = 0.618033988749895;
  var hue = (Math.random() + ratio) % 1;
  var saturation = Math.round(Math.random() * 100) % 85;
  var lightness = Math.round(Math.random() * 100) % 85;

  var color =
    "hsl(" + Math.round(360 * hue) + "," + saturation + "%," + lightness + "%)";
  var oddColor =
    "hsl(" +
    Math.round(360 * hue) +
    "," +
    saturation +
    "%," +
    (lightness + 5) +
    "%)";

  return {
    color,
    oddColor,
  };
};

function ColorSpotter(board, count,callback) {
  this.board = document.querySelector(board);
  this.count = count;
  this.callback = callback
  this.randomIndex = -1;
  this.score = 0;
  this.init();
  this.bindEvents();
}

ColorSpotter.prototype.arrangeGrid = function (count) {
  this.board.style.gridTemplateColumns = `repeat(${count},auto)`;
};

ColorSpotter.prototype.init = function () {
  this.arrangeGrid(this.count);
  const { color, oddColor } = getRandomColors();
  for (let i = 0; i < this.count * this.count; i++) {
    let box = document.createElement("div");
    box.classList.add("box");
    box.style.backgroundColor = color;
    box.dataset.boxIndex = i;
    this.board.appendChild(box);
  }
  this.randomIndex = Math.floor(Math.random() * this.count * this.count);
  this.board.children[this.randomIndex].style.backgroundColor = oddColor;
  this.callback(this.score);
};

ColorSpotter.prototype.updateGrid = function () {
  this.board.replaceChildren([]);
  this.init();
};

ColorSpotter.prototype.onClick = function (e) {
  const index = e.target.dataset.boxIndex;
  if (!index) return;
  if (parseInt(index, 10) === this.randomIndex) {
    this.count++;
    this.score++;
    this.updateGrid();
  } else {
    this.count = this.count - this.score;
    this.score = 0;
    function removeShake() {
      this.board.classList.remove("shake");
    }
    this.board.classList.add("shake");
    setTimeout(removeShake.bind(this), 800);
    this.updateGrid();
  }
};

ColorSpotter.prototype.bindEvents = function () {
  this.board.addEventListener("click", this.onClick.bind(this));
};