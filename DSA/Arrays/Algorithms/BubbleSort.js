
/** 
 * Compare the two consecutive elements , if they are not in sequence -> swap them
*/

function bubbleSort(nums){
    let n = nums.length
    for(let i=0; i < n; i++){

        for(let j=0; j < n-i-1;j++){
            if(nums[j] > nums[j+1]){
                [nums[j],nums[j+1]] = [nums[j+1],nums[j]]
            }
        }
        console.log(i,'->',nums)
    }
    return nums
}

/**
 * 
 * @param {[number]} nums 
 * @returns {[number]} sorted nums
 * Here for second example we came to see that after iteration 3, no swaps are done as the entire array is sorted
 */
function modifiedBubbleSort(nums){
    let n = nums.length
    for(let i=0; i < n; i++){
        let swapped = false
        for(let j=0; j < n-i-1;j++){
            if(nums[j] > nums[j+1]){
                [nums[j],nums[j+1]] = [nums[j+1],nums[j]]
                swapped = true
            }
        }
        console.log(i,'->',nums)
        if(!swapped){
            break
        }
    }
    return nums
}

console.log(bubbleSort([1,3,45,2,34,63]))
console.log(bubbleSort([70,30,20,40,10,11,14]))
console.log(modifiedBubbleSort([1,3,45,2,34,63]))
console.log(modifiedBubbleSort([70,30,20,40,10,11,14]))