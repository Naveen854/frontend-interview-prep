
/** 
 * A function to retains the properties of maxHeap
 * @param {Number[]} arr - An array of integers
 * @param {Number} index - starting index of last parent of a leaf
*/
function maxHeapify(heap,index){
    let left = 2 * index + 1
    let right = 2 * index + 2
    let largest = index
    if(left < heap.length && heap[left] > heap[largest]){
        largest = left
    }
    if(right < heap.length && heap[right] > heap[largest]){
        largest = right
    }
    if(largest !== index){
        [heap[largest],heap[index]] = [heap[index],heap[largest]]
        heap = maxHeapify(heap,largest)
    }
    return heap
}

/** 
 * A function that converts given array into maxHeap array
 * @param {Number[]} arr - An array of integers
*/
function convertToMaxHeap(arr){
    let startIndex  = Math.floor(arr.length / 2) - 1
    let maxHeap;
    while(startIndex >= 0){
        maxHeap = maxHeapify(arr,startIndex)
        startIndex--
    }
    return maxHeap;
}


console.log(convertToMaxHeap([-2,1,5,9,4,6,7])) // [ 9, 4, 7, 1, -2, 6, 5 ]