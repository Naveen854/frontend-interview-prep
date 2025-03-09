class Graph {
  constructor(vertices) {
    this.vertices = vertices;
    this.adjacencyList = new Map();
  }

  addVertex(v) {
    this.adjacencyList.set(v, []);
  }

  removeVertex(){
    
  }

  removeEdge(){

  }

  addEdge(vertex1, vertex2) {
    if (!this.adjacencyList.get(vertex1)) {
      this.addVertex(vertex1);
    }
    if (!this.adjacencyList.get(vertex2)) {
      this.addVertex(vertex2);
    }
    this.adjacencyList.get(vertex1).push(vertex2);
    this.adjacencyList.get(vertex2).push(vertex1);
  }

  print() {
    for (let vertex of this.adjacencyList) {
      console.log(vertex);
    }
  }

  bfs(start) {
    let visited = new Set([start]);
    let queue = [start];

    while (queue.length !== 0) {
      const node = queue.pop();
      console.log(node);
      visited.add(node);
      const neighbors = this.adjacencyList.get(node);
      for (let neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.unshift(neighbor);
          visited.add(neighbor);
        }
      }
    }
  }

  DFSUtil(vert, visited) {
    visited.add(vert);
    console.log(vert);
    var neighbors = this.adjacencyList.get(vert);
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) this.DFSUtil(neighbor, visited);
    }
  }
  dfs(start) {
    let visited = new Set();
    this.DFSUtil(start, visited);
  }
}
var g = new Graph(6);
var vertices = ["A", "B", "C", "D", "E", "F"];

// adding vertices
for (var i = 0; i < vertices.length; i++) {
  g.addVertex(vertices[i]);
}

g.addEdge("A", "B");
g.addEdge("A", "D");
g.addEdge("A", "E");
g.addEdge("B", "C");
g.addEdge("D", "E");
g.addEdge("E", "F");
g.addEdge("E", "C");
g.addEdge("C", "F");

g.print();

g.bfs("A");
g.dfs("A");
