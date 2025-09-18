/**
 * @description given an array of integers find the kth smallest element
 *
 */

//BRUTE FORCE
/**
* @description Finding Kth smallest by sorting and return element at index k-1
    Time Complexity - O(nlog(n))
    Space Complexity - O(n) - if merge sort is used internally by using an array
*/
// function kthSmallest(nums,k){
//     if(k > nums.length){
//         return -1
//     }
//     nums.sort()
//     return nums?.[k-1]
// }

// Selection Sort
/**
 * @description Finding Kth smallest by sorting and return element at index k-1
 * By the selection procedure , we get correct position(index) of pivot element in quicksort
 * By that position, we either move left or right as follows
 *      k < m, we move left
 *      k > m, we move right
 * Time Complexity
 *  The worst case -> O(n^2)
 *  The Average/Best Case - O(n)
 */

function partition(arr, left, right) {
  let pivot = arr[left];
  let i = left;
  for (let j = i + 1; j <= right; j++) {
    if (arr[j] >= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i], arr[left]] = [arr[left], arr[i]];
  return i;
}

function getKthSmallest(arr, k, left, right) {

let requiredIndex = k - 1
  if(left === right && left === requiredIndex) return arr[left]
  let middle = partition(arr, left, right);
  
  if(middle === requiredIndex) return arr[middle]
  if (middle < requiredIndex) {
    return getKthSmallest(arr, k, middle + 1 , right);
  } else {
    return getKthSmallest(arr, k, left, middle - 1);
  }
}

// SELECTION PROCEDURE
function kthSmallest(nums, k) {
  if(k==0) return -1
  return getKthSmallest(nums,k,0,nums.length-1)
}

// BRUTE FORCE MAIN
// function kthSmallest(nums, k) {
//     if (k > nums.length) {
//       return -1;
//     }
//     nums.sort();
//     return nums?.[k - 1];
//   }

// DriverCode
const nums = [33, 25, 20, 45, 67, 89, 24, 58];

console.log(kthSmallest([3,2,1,5,6,4], 2));
console.log(kthSmallest([3,2,3,1,2,4,5,5,6],4))
// console.log("SORTED",nums)
