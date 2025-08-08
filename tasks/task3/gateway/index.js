import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway } from '@apollo/gateway';

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'booking', url: 'http://booking-subgraph:4001' },
    { name: 'hotel', url: 'http://hotel-subgraph:4002' }
  ],
  debug: true
});

const server = new ApolloServer({ 
  gateway, 
  subscriptions: false,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  }
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => ({ req }),
}).then(({ url }) => {
  console.log(`Gateway ready at ${url}`);
  console.log('Gateway configuration:');
  console.log('  - Service List:', gateway.serviceList);
  console.log('  - Debug mode: enabled');
});
