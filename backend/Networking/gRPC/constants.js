
const NEWS_PROTO_PATH = "./news.proto";
const TODOS_PROTO_PATH = './todos.proto'
const ProtoLoaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
};

const GRPC_SERVER_IP = "127.0.0.1:50051"

module.exports = {
    NEWS_PROTO_PATH,
    TODOS_PROTO_PATH,
    ProtoLoaderOptions,
    GRPC_SERVER_IP
}