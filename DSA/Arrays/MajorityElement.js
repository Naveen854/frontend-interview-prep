/**
 @description find an majority element in the array where there at least one majority element where frequency(majorityElement) > n // 2
*/

function getMajorityElement(nums){
    let count = 0
    let candidate= null
    for(let num of nums){
        if(count === 0){
            candidate = num
        }
        if(num === candidate){
            count++
        }else{
            count--
        }
    }
    return candidate
}

function isMajority(nums,candidate){
    let count= 0
    for(let num of nums){
        if(num === candidate){
            count++
        }
    }
    return count > Math.floor(nums.length / 2)
}



function hasMajorityElement(nums){
    const majorityCandidate = getMajorityElement(nums)
    const isMajorityElement =  isMajority(nums,majorityCandidate)
    return isMajorityElement
}

function majorityElement(nums){
    return getMajorityElement(nums)
}


// Find MajorityElement
console.log(majorityElement([2,5,5,3,5,5,2]))
// Does array has majorityElement
console.log(hasMajorityElement([2,5,5,3,5,5,2]))