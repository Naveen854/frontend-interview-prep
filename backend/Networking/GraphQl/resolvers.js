const data = {
  authors: [
    {
      id: "1",
      name: "Author 1",
      bookIds: ["101", "102"],
    },
    {
      id: "2",
      name: "Author 2",
      bookIds: ["103"],
    },
  ],
  books: [
    {
      id: "101",
      title: "Book 1",
      publishedYear: 200,
      authorId: "1",
    },
    {
      id: "102",
      title: "Book 1",
      publishedYear: 200,
      authorId: "1",
    },
    {
      id: "103",
      title: "Book 1",
      publishedYear: 200,
      authorId: "2",
    },
  ],
};

export const resolvers = {
  Book: {
    author: (parent, args, context, info) => {
      return data.authors.find((author) => author.id === parent.authorId);
    },
  },
  Author: {
    books: (parent, args, context, info) => {
      return data.books.filter((book) => parent.bookIds.includes(book.id));
    },
  },
  Query: {
    hello: () => "Hello World",
    books: () => data.books,
    authors: () => data.authors,
  },
};
