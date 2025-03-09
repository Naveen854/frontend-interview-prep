const MEMORY_GAME_HIGH_SCORE = 'MEMORY_GAME_HIGH_SCORE' 

function delay(t, val) {
    return new Promise(resolve => setTimeout(resolve, t, val));
}

function MemoryGame(el,count,callback){
    this.board = document.querySelector(el);
    this.count = count;
    this.callback = callback
    this.level = 1;
    this.button = null;
    this.history = []
    this.currentHistory = []
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem(MEMORY_GAME_HIGH_SCORE) ?? '0',10)
    this.init()
    this.bindEvents()
}

MemoryGame.prototype.init = function(){
    this.board.style.gridTemplateColumns=`repeat(${this.count}, auto)`
    const fragment = document.createDocumentFragment()
    for(let i=0; i < this.count; i++){
        const box = document.createElement('div');
        box.classList.add('box')
        box.dataset.boxIndex = i
        fragment.appendChild(box)
    }

    this.board.appendChild(fragment)
    let startButton = document.createElement('button')
    startButton.innerText = 'Start'
    this.button = startButton
    this.board.appendChild(startButton)
    this.callback(this.score, this.highScore)
}

MemoryGame.prototype.onClick = function(e){
    if(e?.target?.innerText === "Start"){
        this.start()
        return;
    }
    let index = e.target.dataset.boxIndex;
    if(!index) return

    index = parseInt(index,10)
    const currentHistoryLen = this.currentHistory.push(index)
    if(currentHistoryLen !== this.level) return
    this.calculateWinner()
}

MemoryGame.prototype.calculateWinner = function(){
    const isWinner = this.isUserWonCurrentLevel()
    if(isWinner){
        this.upgradeScoreAndLevel()
        this.clearHistory()
        this.start()
    }else{
        this.reset()
    }
    this.callback(this.score,this.highScore)
}

MemoryGame.prototype.upgradeScoreAndLevel = function(){
    this.level++
    this.score++
    if(this.score > this.highScore) {
        this.highScore++;
        localStorage.setItem(MEMORY_GAME_HIGH_SCORE,this.highScore.toString())
    }
}

MemoryGame.prototype.clearHistory = function(){
    this.history = []
    this.currentHistory = []
}

MemoryGame.prototype.reset = function(){
    this.clearHistory()
    this.score = 0;
    this.level = 1;
    this.button.disabled = false
    this.board.classList.add('shake')
    function removeShake(){
        this.board.classList.remove('shake')
        this.start()
    }
    setTimeout(removeShake.bind(this),800)
}

MemoryGame.prototype.isUserWonCurrentLevel = function(){
    for(let i=0; i< this.level; i++){
        if(this.history[i] !== this.currentHistory[i]){
            return false
        }
    }
    return true
}

MemoryGame.prototype.start = function(){
    // disabling button
    this.button.disabled = true
    function turnoffBlink(){
        this.classList.remove('blue')
    }
    for(let i=0; i< this.level; i++){
        const randomIndex = Math.floor(Math.random()*this.count)
        const box = this.board.children[randomIndex]
        setTimeout(() => {
            box.classList.add('blue');
            setTimeout(turnoffBlink.bind(box), 500);
        }, i * 600);
        this.history.push(randomIndex)
    }
}

MemoryGame.prototype.bindEvents = function(){
    this.board.addEventListener('click',this.onClick.bind(this))
}