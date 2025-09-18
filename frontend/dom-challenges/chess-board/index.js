
function ChessBoard(el, count){
    this.board = document.querySelector(el);
    this.count = count;
    this.init()
    this.bindEvents()
}

ChessBoard.prototype.init = function(){
    this.board.style.gridTemplateColumns = `repeat(${this.count}, auto)`
    for(let i=0; i < this.count;i++){
        for(let j=0 ; j < this.count; j++){
            const box = document.createElement('div');
            box.classList.add('box',((i+j)%2) === 0 ? "white":"black");
            box.dataset.indices = `${i}-${j}`
            this.board.appendChild(box)
        }
    }
}

ChessBoard.prototype.onMouseOver = function(e){
    const indices = e.target.dataset.indices;
    if(!indices) return;
    const [row,column] = indices.split("-").map(Number);
    this.onMouseLeave()
    this.fillTopLeft(row,column)
    this.fillTopRight(row,column)
    this.fillBottomLeft(row,column)
    this.fillBottomRight(row,column)
}

ChessBoard.prototype.fillTopLeft = function(row,column){
    while(row >= 0 && column >= 0){
        let boxIndex = row * this.count + column;
        this.board.children[boxIndex].classList.add('orange')
        row--;
        column--;
    }
}

ChessBoard.prototype.fillTopRight = function(row,column){
    row--;
    column++;
    while(row >= 0 && column < this.count){
        let boxIndex = row * this.count + column;
        this.board.children[boxIndex].classList.add('orange')
        row--;
        column++;
    }    
}

ChessBoard.prototype.fillBottomLeft = function(row,column){
    row++;
    column--;
    while(row < this.count && column >= 0){
        let boxIndex = row * this.count + column;
        this.board.children[boxIndex].classList.add('orange')
        row++;
        column--;
    }
}
ChessBoard.prototype.fillBottomRight = function(row,column){
    row++;
    column++;
    while(row < this.count && column < this.count){
        let boxIndex = row * this.count + column;
        this.board.children[boxIndex].classList.add('orange')
        row++;
        column++;
    }
}

ChessBoard.prototype.onMouseLeave = function(){
    const boxes = document.querySelectorAll('.box.white.orange, .box.black.orange')
    for(let i = 0; i < boxes.length ;i++){
        boxes[i].classList.remove('orange')
    }
}

ChessBoard.prototype.bindEvents = function(){
    this.board.addEventListener('mouseover',this.onMouseOver.bind(this))
    this.board.addEventListener('mouseleave',this.onMouseLeave.bind(this))
}