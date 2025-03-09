

function generateSelector(root, target){
    if (!root.contains(target)) {
      throw new Error("Target is not inside the root element.");
    }

    let selectors = []
    let current = target
    while(current !== root){
        let tagName = current.tagName.toLowerCase();
        const parent = current.parentElement;
        if(parent){
            const siblings = Array.from(parent.children).filter(child =>(child.tagName === current.tagName));
            if(siblings.length === 1){
                selectors.unshift(tagName)
            } else{
                const index = siblings.indexOf(current)+1
                selectors.unshift(`${tagName}:nth-of-type(${index})`)
            }
        }
        current = current.parentElement;
    }
    selectors.unshift(root.tagName.toLowerCase())
    return selectors.join(" > ")
}

// const root = document.getElementById("root");
// const target = document.getElementsByTagName("a")


const root = document.querySelector("section");
const target = document.getElementById("product")
console.log("root",root)
console.log("pr",target)

console.log(generateSelector(root, target))