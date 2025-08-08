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
const bookingClient = new BookingServiceClient(
  'booking-service:9090',
  credentials.createInsecure()
);

// Промисфицируем gRPC методы
const listBookingsAsync = promisify(bookingClient.listBookings.bind(bookingClient));

const resolvers = {
  Query: {
    bookingsByUser: async (_, { userId }) => {
      try {
        console.log(`Fetching bookings for user: ${userId}`);
        
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
        const request = new BookingListRequest();
        request.setUserId(reference.userId);
        
        const response = await listBookingsAsync(request);
        const booking = response.getBookingsList().find(b => b.getId() === reference.id);
        
        if (booking) {
          const result = {
            id: booking.getId(),
            userId: booking.getUserId(),
            hotelId: booking.getHotelId(),
            promoCode: booking.getPromoCode() || null,
            discountPercent: booking.getDiscountPercent()
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
      const hotelReference = { __typename: "Hotel", id: parent.hotelId };
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
});

startStandaloneServer(server, {
  listen: { port: 4001 },
  context: async ({ req }) => ({ req }),
}).then(() => {
  console.log('Booking subgraph ready at http://localhost:4001/');
});
