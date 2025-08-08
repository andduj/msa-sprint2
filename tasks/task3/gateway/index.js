import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const gateway = new ApolloGateway({
  debug: true,
  // Отключаем CSRF защиту для разработки
  csrfPrevention: false
});

const server = new ApolloServer({
  gateway,
  // Отключаем CSRF защиту
  csrfPrevention: false
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`Gateway ready at ${url}`);
