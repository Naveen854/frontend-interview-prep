/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function getMedian(dividend, divisor) {
    return (dividend / divisor)
}

// BRUTE FORCE APPROACH
/**
    Merge the two arrays - we create a array O(m+n)
    Sort the array and return  - n logn
    return the mid
 */
// var findMedianSortedArrays = function(nums1, nums2) {
// small problem 
// const arr = [...nums1,...nums2]
// arr.sort((a,b)=>a-b)
// const index = Math.floor(arr.length/2)
// if(arr.length % 2){
//     return getMedian(arr[index],1)
// }else{
//     return getMedian(arr[index]+arr[index-1],2)
// }
// };

function mergeSortedArrays(arr1, arr2) {
    let i = 0
    let j = 0
    let result = []
    while (i < arr1.length && j < arr2.length) {

        if (arr1[i] < arr2[j]) {
            result.push(arr1[i])
            i++
        } else {
            result.push(arr2[j])
            j++
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i])
        i++
    }
    while (j < arr2.length) {
        result.push(arr2[j])
        j++
    }
    console.log("i", result)
    return result
}

// var findMedianSortedArrays = function (nums1, nums2) {
//     const mergedArray = mergeSortedArrays(nums1, nums2)
//     const index = Math.floor(mergedArray.length/2)
//     if(mergedArray.length % 2){
//         return getMedian(mergedArray[index],1)
//     }else{
//         return getMedian(mergedArray[index]+mergedArray[index-1],2)
//     }
// };

// Approach 2
// Using binary search
/*
    As the arrays are sorted 
    let's keep pointers to 
*/
var findMedianSortedArrays = function (nums1, nums2) {
    if(nums1.length > nums2.length){
        [nums1,nums2] = [nums2,nums1]
    }
    let x = nums1.length
    let y = nums2.length
    let left = 0
    let right = x
    let halfLen = Math.floor((x+y+1) / 2)

    while(left <= right){
        let part1 = Math.floor((left + right) / 2)
        let part2 =  halfLen - part1

        let left1 = part1 > 0 ? nums1[part1 - 1] : Number.NEGATIVE_INFINITY
        let right1 = part1 < x ? nums1[part1] : Number.POSITIVE_INFINITY
        let left2 = part2 > 0 ? nums2[part2 - 1] : Number.NEGATIVE_INFINITY 
        let right2 = part2 < y ? nums2[part2] : Number.POSITIVE_INFINITY

        if(left1 <= right2 && left2 <= right1){
            if((x+y) % 2 === 0){
                return (Math.max(left1,left2) + Math.min(right1,right2)) / 2
            }else{
                return Math.max(left1,left2)
            }
        }else if(left1 > right2){
            right = part1 - 1
        }else{
            left = part1 + 1
        }
    }
};