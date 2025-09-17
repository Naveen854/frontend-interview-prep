import { ApolloServer } from "@apollo/server";
import {startStandaloneServer} from '@apollo/server/standalone'

import {resolvers} from './resolvers.js'
import {typeDefs} from './typeDefs.js'

const Server = new ApolloServer({
    typeDefs,
    resolvers
})

const {url} = await startStandaloneServer(Server)
console.log(`GraphQL running on URL:${url}`)