export const typeDefs = `#graphql

type Author {
  id: ID!
  name: String!
  books: [Book]
}

type Book {
  id: ID!
  title: String!
  publishedYear: Int
  author: Author
}

type Query {
  hello: String
  authors: [Author]
  books: [Book]
}
`