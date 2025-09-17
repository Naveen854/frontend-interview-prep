function twoPointersSort(nums) {
  let p0,
    current = 0;
  let p2 = nums.length - 1;
  while (current <= p2) {
    console.log(p2, current);
    if (nums[current] === 0) {
      [nums[p0], nums[current]] = [nums[current], nums[p0]];
      p0++;
      current++
    } 
    if (nums[current] === 2) {
      if(nums[current] !== nums[p2]){
        [nums[p2], nums[current]] = [nums[current], nums[p2]];
      }
      p2--;
    }else{
        current++
    }
  }
  return nums;
}

// Better Approach
function countSort(nums) {
  let zerosCount = 0;
  let onesCount = 0;
  let twosCount = 0;

  for (let num of nums) {
    if (num === 0) zerosCount++;
    if (num === 1) onesCount++;
    if (num === 2) twosCount++;
  }
  // console.log(zerosCount)
  // console.log(onesCount)
  // console.log(twosCount)

  let currentLength = 0;
  while (zerosCount > 0 && currentLength < nums.length) {
    nums[currentLength] = 0;
    currentLength++;
    zerosCount--;
  }
  // console.log(currentLength)
  // console.log(onesCount)
  // console.log(twosCount)
  while (onesCount > 0 && currentLength < nums.length) {
    nums[currentLength] = 1;
    currentLength++;
    onesCount--;
  }
  while (twosCount > 0 && currentLength < nums.length) {
    nums[currentLength] = 2;
    currentLength++;
    twosCount--;
  }
}

const sortColors = (nums) => {
  // BRUTE FORCE
  // nums.sort()

  // BETTER APPROACH
  // countSort(nums)

  // OPTIMAL APPROACH
  twoPointersSort(nums);
};
const nums = [2, 1, 1, 1, 0, 2];
// sortColors(nums)
console.log(nums);
console.log(twoPointersSort(nums));
