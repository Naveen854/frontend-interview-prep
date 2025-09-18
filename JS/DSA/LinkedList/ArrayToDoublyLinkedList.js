class ListNode{
    constructor(val = undefined,next = null,prev = null){
        this.val = val
        this.next = next
        this.prev = prev
    }
}


function convertArrayToDoublyLinkedList(nums){
    let head = new ListNode(nums[0])
    let prev = head
    for(let i =1; i < nums.length; i++){
        let newNode = new ListNode(nums[i],null,prev)
        prev.next = newNode
        prev = newNode
    }
    return head
}

function printDoublyLinkedList(head) {
    let result = [];
    let current = head;
    
    while(current !== null) {
        // Add arrows to show connections
        if (result.length > 0) {
            result.push('⟺');
        }
        result.push(current.val);
        current = current.next;
    }
    
    console.log('Forward:', result.join(' '));
    
    // Print backward
    result = [];
    current = head;
    while(current.next !== null) {
        current = current.next;
    }
    
    while(current !== null) {
        if (result.length > 0) {
            result.push('⟺');
        }
        result.push(current.val);
        current = current.prev;
    }
    
    console.log('Backward:', result.join(' '));
}

let result = convertArrayToDoublyLinkedList([1,43,24,6,20,62,34])
printDoublyLinkedList(result)