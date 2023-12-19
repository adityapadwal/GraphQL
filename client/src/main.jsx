import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'; 

// Importing Apollo Client for GraphQL
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient ({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    
  </React.StrictMode>,
)
