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
    hotel: Hotel
  }

  extend type Hotel @key(fields: "id") {
    id: ID! @external
  }

  type Query {
    bookingsByUser(userId: String!): [Booking]
  }
`;

// Создаем gRPC клиент
let bookingClient;
try {
  bookingClient = new BookingServiceClient(
    'booking-service:9090',
    credentials.createInsecure()
  );
  console.log('gRPC client initialized successfully');
} catch (error) {
  console.error('Failed to initialize gRPC client:', error);
  bookingClient = null;
}

// Промисфицируем gRPC методы
const listBookingsAsync = bookingClient ? promisify(bookingClient.listBookings.bind(bookingClient)) : null;

const resolvers = {
  Query: {
    bookingsByUser: async (_, { userId }, { req }) => {
      try {
        const headerUserId = req?.headers?.['userid'] || req?.headers?.['userId'];
        console.log(`Fetching bookings for user arg='${userId}', header='${headerUserId}'`);

        // ACL: если заголовок отсутствует или не совпадает с userId запроса — возвращаем пусто
        if (!headerUserId || headerUserId !== userId) {
          console.log('ACL: access denied (missing or mismatched userid header)');
          return [];
        }
        
        if (!bookingClient || !listBookingsAsync) {
          console.log('gRPC client not available');
          return [];
        }
        
        // Создаем gRPC запрос как plain-object для proto-loader (keepCase: true)
        const request = { user_id: userId };
        console.log('gRPC request object (plain):', request);
        
        // Вызываем gRPC сервис
        const response = await listBookingsAsync(request);
        
        // Преобразуем ответ в GraphQL формат
        console.log('gRPC response structure:', Object.keys(response));
        console.log('gRPC response:', response);
        console.log('gRPC response type:', typeof response);
        console.log('gRPC response bookings:', response.bookings);
        console.log('gRPC response bookings type:', typeof response.bookings);
        console.log('gRPC response bookings length:', response.bookings ? response.bookings.length : 'undefined');
        
        let bookings = [];
        
        // Проверяем, есть ли bookings в ответе
        if (response && response.bookings && Array.isArray(response.bookings)) {
          console.log('Processing bookings array from response.bookings');
          bookings = response.bookings.map(booking => ({
            id: booking.id,
            userId: booking.userId ?? booking.user_id,
            hotelId: booking.hotelId ?? booking.hotel_id,
            promoCode: (booking.promoCode ?? booking.promo_code) || null,
            discountPercent: (booking.discountPercent ?? booking.discount_percent) != null
              ? Math.trunc(booking.discountPercent ?? booking.discount_percent)
              : null
          }));
        } else if (response && response.getBookingsList) {
          // Если есть метод getBookingsList (для совместимости)
          console.log('Processing bookings using getBookingsList method');
          bookings = response.getBookingsList().map(booking => ({
            id: booking.getId(),
            userId: booking.getUserId(),
            hotelId: booking.getHotelId(),
            promoCode: booking.getPromoCode() || null,
            discountPercent: Math.trunc(booking.getDiscountPercent())
          }));
        } else {
          console.error('Unexpected gRPC response structure:', response);
          return [];
        }
        
        // Если gRPC вернул пустой результат, возвращаем пустой массив
        if (bookings.length === 0) {
          console.log('gRPC returned empty result');
          return [];
        }
        
        console.log(`Found ${bookings.length} bookings for user ${userId}`);
        console.log('Bookings:', bookings);
        return bookings;
      } catch (error) {
        console.error(`Error fetching bookings for user ${userId}:`, error);
        return [];
      }
    }
  },
  Booking: {
    __resolveReference: async (reference) => {
      try {
        console.log(`__resolveReference for booking:`, reference);
        
        if (!bookingClient || !listBookingsAsync) {
          console.log('gRPC client not available for __resolveReference');
          return null;
        }
        
        const request = { user_id: reference.userId };
        
        const response = await listBookingsAsync(request);
        
        let booking = null;
        if (response && response.bookings && Array.isArray(response.bookings)) {
          booking = response.bookings.find(b => b.id === reference.id);
        } else if (response && response.getBookingsList) {
          booking = response.getBookingsList().find(b => b.getId() === reference.id);
        }
        
        if (booking) {
          const result = {
            id: booking.id || booking.getId(),
            userId: booking.userId || booking.getUserId(),
            hotelId: booking.hotelId || booking.getHotelId(),
            promoCode: (booking.promoCode || booking.getPromoCode()) || null,
            discountPercent: booking.discountPercent || booking.getDiscountPercent()
          };
          console.log(`__resolveReference result:`, result);
          return result;
        }
        console.log(`Booking not found for reference:`, reference);
        return null;
      } catch (error) {
        console.error(`Error resolving booking reference:`, error);
        return null;
      }
    },
    hotel: async (parent) => {
      console.log(`Resolving hotel for booking ${parent.id} with hotelId: ${parent.hotelId}`);
      
      // Преобразуем hotelId из "hotel1" в "1", "hotel2" в "2" и т.д.
      const numericId = parent.hotelId.replace('hotel', '');
      console.log(`Converted hotelId from ${parent.hotelId} to ${numericId}`);
      
      const hotelReference = { __typename: "Hotel", id: numericId };
      console.log(`Hotel reference:`, hotelReference);
      return hotelReference;
    }
  },
  Hotel: {
    id: (parent) => {
      console.log(`Hotel.id resolver called with:`, parent);
      return parent.id;
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  introspection: true
});

startStandaloneServer(server, {
  listen: { port: 4001 },
  context: async ({ req }) => {
    console.log('Booking-subgraph request headers:', req.headers);
    console.log('Booking-subgraph request body:', req.body);
    return { req };
  },
}).then(() => {
  console.log('Booking subgraph ready at http://localhost:4001/');
}).catch((error) => {
  console.error('Failed to start booking subgraph:', error);
});
