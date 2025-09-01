import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
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
  // Проксируем только входящие заголовки в подграфы (включая userid)
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        try {
          const headers = context?.req?.headers ?? {};
          for (const [key, value] of Object.entries(headers)) {
            if (typeof value === 'string') {
              request.http.headers.set(key, value);
            }
          }
        } catch (e) {
          // no-op
        }
      }
    });
  },
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
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['content-type', 'userid'],
  },
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
