
/** 
 * Here we do keep track of minIndex and we swap them
 * On each iteration the smaller element will be positioned at left the array.
 * On each iteration we keep minIndex as current iteration level index 
        -> minIndex = i
 * We go on iterating from j = i+1 to n 
        -> compare  arr[minIndex] with nums[j]
        -> arr[minIndex] > arr[j] (f they are not in sequence)
            -> minIndex = j
        
 * if there is minIndex which is not current iteration level index
        -> swap(arr[i],arr[mindIndex])
 * 

  The number of comparisions is same as bubble sort
  But it got edge over the the no of swaps
  at each iteration level we are doing single swap
  The total no of swaps for Arry[n] arr will be n
  The time complexity for swaps = O(n)
*/
function selectionSort(nums){
    let n = nums.length
    for(let i=0; i< n; i++){
        let minIndex = i
        for(j=i+1; j < n; j++){
            if(nums[minIndex] > nums[j]){
                minIndex = j
            }
        }
        if(minIndex !== i){
            [nums[minIndex],nums[i]] = [nums[i],nums[minIndex]]
        }
    }
    return nums
}

console.log(selectionSort([1,3,35,45,23,34,63,23]))