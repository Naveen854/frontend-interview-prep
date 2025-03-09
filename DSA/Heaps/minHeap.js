
/** 
 * A function to retains the properties of minHeap
 * @param {number[]} arr - An array of integers
 * @param {number} index - starting index of last parent of a leaf
 * @returns {number[]}
*/
function minHeapify(heap,index){
    let left = 2 * index + 1
    let right = 2 * index + 2
    let smallest = index
    if(left < heap.length && heap[left] < heap[smallest]){
        smallest = left
    }
    if(right < heap.length && heap[right] < heap[smallest]){
        smallest = right
    }
    if(smallest !== index){
        [heap[smallest],heap[index]] = [heap[index],heap[smallest]]
        heap = minHeapify(heap,smallest)
    }
    return heap
}

/** 
 * A function that converts given array into minHeap array
 * @param {number[]} arr - An array of integers
 * @returns {number[]}
*/
function convertToMinHeap(arr){
    let startIndex  = Math.floor(arr.length / 2) - 1
    let minHeap;
    while(startIndex >= 0){
        minHeap = minHeapify(arr,startIndex)
        startIndex--
    }
    return minHeap;
}


console.log(convertToMinHeap([9,4,7,1,-2,6,5])) // [-2,1,5,9,4,6,7]