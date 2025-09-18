function isPalindrome(head) {
    if(!head || !head.next){
        return true
    }

    let slow = head
    let fast = head
    while(fast && fast.next){
        slow = slow.next
        fast = fast.next.next
    }
    let reversed = null
    while(slow){
        let temp = slow.next
        slow.next = reversed
        reversed = slow
        slow = temp
    }
    let l1 = head
    let l2 = reversed
    while(l1 && l2){
        if(l1.val !== l2.val){
            return false
        }
        l1 = l1.next
        l2 = l2.next
    }
    return false
};