
// /*
//  * Creates pixel art grid
//  * @param el DOM Element
//  * @param rows Number of rows
//  * @param rows Number of cols
//  */
// function PixelArt(el, rows, cols) {
//     let currentColor = 'transparent'
//     const grid = document.getElementById('grid')

//     // generate boxes
//     generateBoxes()
//     fillLowerRowWithRadomColor()
//     //fill lower row with random color
    
//     // handle clicks
//     grid.addEventListener('click',onClickBox)

//     function fillLowerRowWithRadomColor(){
//         for(let i= rows*cols; i< (rows+1)*cols;i++){
//             grid.children[i].style.backgroundColor = generateColor()
//         }
//     }

//     function onClickBox(e){
//         const boxIndex = e.target.dataset.boxIndex
//         if(boxIndex < rows * cols){
//             grid.children[boxIndex].style.backgroundColor = currentColor;
//         }
//         else{
//             currentColor = e.target.style.backgroundColor
//             console.log("CUURE",currentColor)
//         }
//     }
//     function generateBoxes(){
//         for(let i=0; i < (rows+1)*cols;i++){
//             const box = document.createElement('div')
//             box.classList.add('box')
//             box.dataset.boxIndex = i
//             grid.appendChild(box)
//         }
//     }


    
//     function generateColor(){
//         const maxRange = 0xffffff;
//         const random = Math.floor(Math.random() * maxRange).toString(16)
//         const randomHex = random.padStart(6,'0').toUpperCase()
//         return `#${randomHex}`
//     }
// }


// Constructor Approach

function PixelArt(el, rows, cols) {
    this.currentColor = 'transparent'
    this.grid = document.querySelector(el);
    this.rows = rows;
    this.cols = cols;
    this.init();
    this.bindEvents();
}

PixelArt.prototype.onClickBox = function(e){
    const box = e.target
    const boxIndex = box.dataset.boxIndex
    if(boxIndex < this.rows * this.cols){
        this.grid.children[boxIndex].style.backgroundColor = this.currentColor;
    }
    else{
        this.currentColor = box.style.backgroundColor
    }
}

PixelArt.prototype.init = function(){
    const maxRange = (this.rows+1) * this.cols
    for(let i=0; i < maxRange ;i++){
        const box = document.createElement('div')
        box.classList.add('box')
        box.dataset.boxIndex = i
        this.grid.appendChild(box)
    }
    for(let i= this.rows * this.cols; i < maxRange ;i++){
        this.grid.children[i].style.backgroundColor = this.generateColor()
    }
}

PixelArt.prototype.generateColor = function(){
    const maxRange = 0xffffff;
    const random = Math.floor(Math.random() * maxRange).toString(16)
    const randomHex = random.padStart(6,'0').toUpperCase()
    return `#${randomHex}`
}

PixelArt.prototype.bindEvents = function(){
    this.grid.addEventListener('click',this.onClickBox.bind(this))
}