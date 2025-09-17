const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { NEWS_PROTO_PATH, TODOS_PROTO_PATH, ProtoLoaderOptions, GRPC_SERVER_IP } = require("./constants");


const newsPackageDefinition = protoLoader.loadSync(NEWS_PROTO_PATH, ProtoLoaderOptions);
const newsProto = grpc.loadPackageDefinition(newsPackageDefinition);

const todosPackageDefinition = protoLoader.loadSync(TODOS_PROTO_PATH, ProtoLoaderOptions);
const todosProto = grpc.loadPackageDefinition(todosPackageDefinition);


const server = new grpc.Server();

let news = [
  { id: "1", title: "Note 1", body: "Content 1", postImage: "Post image 1" },
  { id: "2", title: "Note 2", body: "Content 2", postImage: "Post image 2" },
];

let todos = [
  {
    id: "1",
    title: "Learn REST API",
    completed: false,
  },
  {
    id: "2",
    title: "Learn Communication Protocols",
    completed: false,
  },
];

server.addService(newsProto.NewsService.service, {
  getAllNews: (_, callback) => {
    callback(null, news);
  },
});

server.addService(todosProto.TodosService.service, {
  getAll: (_, callback) => {
    callback(null, {todos});
  },
  get(call,callback){
    const todo = todos.find((todo) => todo.id === call.request.id);
    console.log(call)
    if(todo){
      callback(null,todo)
    }else{
      callback({
        code: grpc.status.NOT_FOUND,
        details:"Not Found"
      })
    }
  }
});

server.bindAsync(
  GRPC_SERVER_IP,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log(`Server running at http://${GRPC_SERVER_IP}`);
  }
);
