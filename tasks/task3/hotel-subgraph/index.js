import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';

const typeDefs = gql`
  type Hotel @key(fields: "id") {
    id: ID!
    name: String
    city: String
    stars: Int
  }

  type Query {
    hotelsByIds(ids: [ID!]!): [Hotel]
  }
`;

// Заглушка данных для тестирования
const mockHotels = [
  {
    id: "hotel1",
    name: "Grand Hotel",
    city: "Moscow",
    stars: 5
  },
  {
    id: "hotel2", 
    name: "Business Inn",
    city: "St. Petersburg",
    stars: 4
  },
  {
    id: "hotel3",
    name: "Comfort Hotel",
    city: "Kazan",
    stars: 3
  }
];

// Функция для получения отеля по ID
function fetchHotelById(id) {
  console.log(`Fetching hotel by ID: ${id}`);
  
  const hotel = mockHotels.find(h => h.id === id);
  if (hotel) {
    console.log(`Found hotel: ${hotel.name}`);
    return hotel;
  } else {
    console.log(`Hotel not found: ${id}`);
    return null;
  }
}

const resolvers = {
  Hotel: {
    __resolveReference: ({ id }) => {
      console.log(`__resolveReference for hotel ID: ${id}`);
      const hotel = fetchHotelById(id);
      console.log(`__resolveReference result for ${id}:`, hotel);
      return hotel;
    }
  },
  Query: {
    hotelsByIds: (_, { ids }) => {
      try {
        console.log(`Fetching hotels by IDs: ${ids.join(', ')}`);
        
        const hotels = ids.map(id => fetchHotelById(id));
        const validHotels = hotels.filter(hotel => hotel !== null);
        console.log(`Found ${validHotels.length} hotels:`, validHotels);
        
        return validHotels;
      } catch (error) {
        console.error(`Error fetching hotels by IDs:`, error);
        return [];
      }
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, {
  listen: { port: 4002 },
}).then(() => {
  console.log('Hotel subgraph ready at http://localhost:4002/');
});
