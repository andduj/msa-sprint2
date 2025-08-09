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
  // Проксируем все входящие заголовки в подграфы (включая userid)
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

          // Если заголовок userid не передан, но есть переменная запроса `variables.userid`,
          // пробрасываем её как заголовок для совместимости с клиентами, где сложно задать headers
          const variablesUserId = context?.req?.body?.variables?.userid;
          if (!request.http.headers.has('userid') && typeof variablesUserId === 'string' && variablesUserId.length > 0) {
            request.http.headers.set('userid', variablesUserId);
          }

          // Доп. совместимость: если userid не найден ни в headers, ни в variables,
          // пробуем извлечь его из текста запроса: bookingsByUser(userId: "...")
          if (!request.http.headers.has('userid')) {
            const queryText = context?.req?.body?.query;
            if (typeof queryText === 'string') {
              const match = queryText.match(/bookingsByUser\s*\(\s*userId\s*:\s*"([^"]+)"/i);
              if (match && match[1]) {
                request.http.headers.set('userid', match[1]);
              }
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
