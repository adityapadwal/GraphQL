const express = require('express');
// const bodyParser = require('body-parser'); (deprecated)
const cors = require('cors');
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4'); // middleware that integrates Apollo Server with an Express app
const { default: axios } = require('axios');

async function startServer() {
    // Creating the express server
    const app = express();

    // Creating the GraphQL server
    const server = new ApolloServer({
        // Defining the GraphQL schema
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                website: String!
            }

            type Todo {
                userId:  ID!
                id: ID!
                title: String!
                completed: Boolean
                user: User
            }

            type Query {
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id: ID!): User
            }
        `,
        resolvers: {
            Todo: {
                user: async(todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)).data,
            },

            Query: {
                getTodos: async () => 
                    (await axios.get(`https://jsonplaceholder.typicode.com/todos`)).data,
                getAllUsers: async () => 
                    (await axios.get(`https://jsonplaceholder.typicode.com/users`)).data,
                getUser: async (parent, {id}) => 
                    (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            }
        },
    });

    // app.use('body-parser'); Don't use this (deprecated)!!! 
    // Instead Use the built-in Express middleware for parsing JSON
    app.use(express.json());
    // Use the built-in Express middleware for parsing URL-encoded bodies
    // Set the extended option explicitly to true
    app.use(express.urlencoded({ extended: true }));

    app.use(cors());

    // Starting the GraphQL server
    await server.start();

    // If an HTTP request comes to "/graphql" then the GrapQL server will handle it
    app.use("/graphql", expressMiddleware(server));

    app.listen((8000), () => {
        console.log("Server running successfully on port 8000");
    });
}

startServer();