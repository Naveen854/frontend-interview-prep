function Tree(data = null, left = null, right = null) {
  this.data = data;
  this.left = left;
  this.right = right;
}

class BinaryTree {
  constructor(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid input: data must be a non-empty array");
    }
    this.root = null;
    this.size = 0;
    this.height = 0;
    this._transform(data);
  }

  _transform(data) {
    const root = new Tree(data[0]);
    let queue = [root];
    let i = 1;
    while (i < data.length) {
      const current = queue.shift();
      if (data[i] !== null) {
        current.left = new Tree(data[i]);
        queue.push(current.left);
      }
      i++;
      if (i < data.length && data[i] !== null) {
        current.right = new Tree(data[i]);
        queue.push(current.right);
      }
      i++;
    }
    this.root = root;
    this.size = data.length;
    this.height = Math.floor(Math.log2(data.length + 1));
  }

  inOrderTraversal = (node, result = []) => {
    if (node === null) {
      return result;
    }
    this.inOrderTraversal(node.left, result);
    result.push(node.data);
    this.inOrderTraversal(node.right, result);
    return result;
  };

  preOrderTraversal = (node, result = []) => {
    if (node === null) {
      return result;
    }
    result.push(node.data);
    this.preOrderTraversal(node.left, result);
    this.preOrderTraversal(node.right, result);
    return result;
  };

  postOrderTraversal = (node, result = []) => {
    if (node === null) {
      return result;
    }
    this.postOrderTraversal(node.left, result);
    this.postOrderTraversal(node.right, result);
    result.push(node.data);
    return result;
  };
}

const data = [
  "R",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  null,
  null,
  null,
  null,
  null,
  null,
  "G"
];
const tree = new BinaryTree(data);
console.log(tree.preOrderTraversal(tree.root));
console.log(tree.inOrderTraversal(tree.root));
console.log(tree.postOrderTraversal(tree.root));


/**
 *          R
 *         / \ 
 *        A   B
 *       / \ / \
 *     C  D E  F
 * 
 */