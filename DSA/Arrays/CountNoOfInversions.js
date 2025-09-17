

function merge(nums,left,mid,right){
    let i = left
    let count = 0
    while(i <= mid){
        j = mid+1
        while(j <= right){
            if(nums[i] > nums[j]){
                count++
            }
            j++
        }
        i++
    }
    return count
}

function countNoOfInversion(nums,left,right){
    if(left === right){
        return 0
    }
    let mid = left + Math.floor((right -left) / 2)
    const countL = countNoOfInversion(nums, left, mid)
    const countR = countNoOfInversion(nums, mid+1, right)
    return (countL + countR + merge(nums, left, mid, right))
}

// Driver Code
const nums = [70,50,60,10,20,30,80,15]
console.log("THE NO OF INVERSION IS:",countNoOfInversion(nums,0,nums.length-1))