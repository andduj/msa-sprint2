import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { IntrospectAndCompose } from '@apollo/gateway';

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'booking', url: 'http://booking-subgraph:4001' },
      { name: 'hotel', url: 'http://hotel-subgraph:4002' }
    ]
  }),
  debug: true
});

const server = new ApolloServer({ 
  gateway, 
  subscriptions: false,
  csrfPrevention: false, // Отключаем CSRF защиту
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  }
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    console.log('📥 Request headers:', req.headers);
    console.log('📥 Request body:', req.body);
    return { req };
  },
}).then(({ url }) => {
  console.log(`Gateway ready at ${url}`);
  console.log('Gateway configuration:');
  console.log('  - IntrospectAndCompose: enabled');
  console.log('  - Debug mode: enabled');
  console.log('  - CSRF prevention: disabled');
});
