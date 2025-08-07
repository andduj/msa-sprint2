import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import { credentials } from '@grpc/grpc-js';
import { promisify } from 'util';

// Импортируем proto файл для gRPC (CommonJS формат)
import { BookingServiceClient } from './generated/booking_grpc.js';
import { BookingListRequest } from './generated/booking_pb.js';

const typeDefs = gql`
  type Booking @key(fields: "id") {
    id: ID!
    userId: String!
    hotelId: String!
    promoCode: String
    discountPercent: Int
  }

  type Query {
    bookingsByUser(userId: String!): [Booking]
  }
`;

// Создаем gRPC клиент
const bookingClient = new BookingServiceClient(
  'booking-service:9090',
  credentials.createInsecure()
);

// Промисфицируем gRPC методы
const listBookingsAsync = promisify(bookingClient.listBookings.bind(bookingClient));

const resolvers = {
  Query: {
    bookingsByUser: async (_, { userId }, { req }) => {
      // ACL проверка - пользователь может видеть только свои бронирования
      const requestUserId = req.headers['userid'];
      if (!requestUserId) {
        console.log('❌ ACL: No userid header provided');
        return [];
      }
      
      if (requestUserId !== userId) {
        console.log(`❌ ACL: User ${requestUserId} cannot access bookings for user ${userId}`);
        return [];
      }

      try {
        console.log(`🔍 Fetching bookings for user: ${userId}`);
        
        // Создаем gRPC запрос
        const request = new BookingListRequest();
        request.setUserId(userId);
        
        // Вызываем gRPC сервис
        const response = await listBookingsAsync(request);
        
        // Преобразуем ответ в GraphQL формат
        const bookings = response.getBookingsList().map(booking => ({
          id: booking.getId(),
          userId: booking.getUserId(),
          hotelId: booking.getHotelId(),
          promoCode: booking.getPromoCode() || null,
          discountPercent: booking.getDiscountPercent()
        }));
        
        console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);
        return bookings;
      } catch (error) {
        console.error(`❌ Error fetching bookings for user ${userId}:`, error);
        return [];
      }
    },
  },
  Booking: {
    __resolveReference: async (reference) => {
      // Для Federation - получение отдельного бронирования по ID
      try {
        const request = new BookingListRequest();
        request.setUserId(reference.userId);
        
        const response = await listBookingsAsync(request);
        const booking = response.getBookingsList().find(b => b.getId() === reference.id);
        
        if (booking) {
          return {
            id: booking.getId(),
            userId: booking.getUserId(),
            hotelId: booking.getHotelId(),
            promoCode: booking.getPromoCode() || null,
            discountPercent: booking.getDiscountPercent()
          };
        }
        return null;
      } catch (error) {
        console.error(`❌ Error resolving booking reference:`, error);
        return null;
      }
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, {
  listen: { port: 4001 },
  context: async ({ req }) => ({ req }),
}).then(() => {
  console.log('✅ Booking subgraph ready at http://localhost:4001/');
});
