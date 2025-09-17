const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { TODOS_PROTO_PATH, ProtoLoaderOptions, GRPC_SERVER_IP } = require('../constants')

const todosPackageDefinition = protoLoader.loadSync(TODOS_PROTO_PATH,ProtoLoaderOptions)

const TodosService = grpc.loadPackageDefinition(todosPackageDefinition).TodosService

const client = new TodosService(
  GRPC_SERVER_IP,
  grpc.ChannelCredentials.createInsecure()
)

module.exports = client