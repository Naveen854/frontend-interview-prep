

function insertionSort(arr){
    let n = arr.length
    for(let i = 1 ; i < n; i++){
        let key = arr[i]
        let j = i - 1
        while(j >= 0 && key < arr[j]){
            [arr[j],arr[j+1]] = [arr[j+1],arr[j]]
            j--
        }
        arr[j+1] = key
    }
    return arr
}

console.log(insertionSort([34,32,232,4,235,35462,23426,346]))

// i = 1 , key = 34 , j = 0
// 