export class Node {
    constructor(data, next){
        this.data = data;
        this.next = next;
    }
}

// Linked List with only head property
// class LinkedList {
//     constructor(){
//         this.head = null
//     }

//     insertAtFront(data){
//         let newNode = new Node(data)
//         if(!this.head){
//             this.head = newNode
//         }else{
//             newNode.next = this.head;
//             this.head = newNode;
//         }
//     }

//     insertAtEnd(data){
//         if(!this.head){
//             this.insertAtFront(data)
//             return;
//         }
//         let curr = this.head;
//         while(curr.next){
//             curr = curr.next
//         }
//         let newNode = new Node(data)
//         curr.next = newNode
//     }

//     insertAfterNode(prevNode, data){
//         if(!prevNode){
//             this.insertAtFront(data)
//             return
//         }
//         let newNode = new Node(data)
//         newNode.next = prevNode.next
//         prevNode.next = newNode
//     }

//     print(){
//         let curr = this.head
//         let arr = []
//         while(curr){
//             arr.push(curr.data.toString())
//             curr = curr.next
//         }
//         console.log(arr.join(' -> '))
//     }


// }

// Linked List with head and tail ,length properties
export class LinkedList {
    constructor(){
        this.head = null
        this.tail = null
        this.length = 0
    }

    insertAtFront(data){
        let newNode = new Node(data)
        if(!this.head){
            this.head = newNode
            this.tail = newNode
        }else{
            newNode.next = this.head;
            this.head = newNode;
        }
    }

    insertAtEnd(data){
        if(!this.head){
            this.insertAtFront(data)
            return;
        }
        let curr = this.head;
        while(curr.next){
            curr = curr.next
        }
        let newNode = new Node(data)
        curr.next = newNode
        this.tail = newNode
    }

    insertAfterNode(prevNode, data){
        if(!prevNode){
            console.warn('Prev Node must be present in your linked list')
            return
        }
        let newNode = new Node(data)
        newNode.next = prevNode.next
        prevNode.next = newNode
    }

    deleteAtPosition(position){
        let curr = this.head
        for(let i= 0 ; i < position -1;i++){
            curr = curr.next
            if(!curr){
                return
            }
        }
        let temp = curr.next.next
        curr.next = null
        curr.next = temp        
    }

    countNodes(){
        let curr = this.head
        let count = 0
        while(curr){
            curr = curr.next
            count++
        }
        return count
    }

    search(data){
        // let curr = this.head
        // while(curr){
        //     if(curr.data === data){
        //         return true
        //     }
        //     curr = curr.next
        // }
        // return false
        let current = this.head;
        for (let node = current; !!node ; node = node?.next) {
            if (node && node.data === data) {
                return true;
            }
        }
        return false;
    }

    print(){
        let curr = this.head
        let arr = []
        while(curr){
            arr.push(curr.data.toString())
            curr = curr.next
        }
        console.log(arr.join(' -> '))
    }

    reverse(){
        let curr = this.head
        let next = null
        let prev = null
        while(curr){
            next = curr.next
            curr.next = prev
            prev = curr
            curr = next
        }
        this.head = prev
    }
}


function mergeLinkedList(llist1,llist2){
    if(!llist1){
        return llist2
    }
    if(!llist2){
        return llist1
    }

    let temp;
    if(llist1.data <= llist2.data){
        temp = llist1
        temp.next = mergeLinkedList(llist1.next, llist2)
    }else{
        temp = llist2
        temp.next = mergeLinkedList(llist1, llist2.next)
    }
    return temp
}

const ll = new LinkedList()

// ll.insertAtFront(10)
// ll.insertAtFront(20)
// ll.insertAtFront(30)
// ll.insertAtFront(40)
// ll.insertAtFront(50)
// ll.insertAtFront(63)
// ll.insertAtFront(70)
ll.insertAtEnd(0)
ll.insertAtEnd(1)
ll.insertAtEnd(2)
ll.insertAtEnd(3)
ll.insertAtEnd(4)
// ll.insertAfterNode(ll.head.next.next,53)
// ll.insertAfterNode(ll.head.next.next.next,32)
// ll.insertAfterNode(ll.head,24)
ll.insertAtFront(45)
ll.insertAtEnd(54)

ll.print()
// ll.reverse()
ll.deleteAtPosition(2)
ll.print()
console.log("NODES COUNT",ll.countNodes())
console.log("SEARCH FOR ",45,ll.search(45))
console.log("SEARCH FOR ",2,ll.search(2))
console.log("SEARCH FOR ",6,ll.search(6))
// ll.print()

let l1 = new LinkedList()
l1.insertAtEnd(6)
l1.insertAtEnd(23)
l1.insertAtEnd(34)
l1.insertAtEnd(45)
l1.insertAtEnd(56)

let l2 = new LinkedList()
l2.insertAtEnd(10)
l2.insertAtEnd(37)
l2.insertAtEnd(48)
l2.insertAtEnd(63)
l2.insertAtEnd(72)

console.log(JSON.stringify(mergeLinkedList(l1.head,l2.head)))
// l1.print()