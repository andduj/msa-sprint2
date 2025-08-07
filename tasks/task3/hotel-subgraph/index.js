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
    _entities(representations: [_Any!]!): [_Entity]!
    _service: _Service!
  }

  scalar _Any
  scalar _FieldSet

  type _Entity {
    ... on Hotel {
      id: ID!
      name: String
      city: String
      stars: Int
    }
  }

  type _Service {
    sdl: String
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
async function fetchHotelById(id) {
  console.log(`🔍 Fetching hotel by ID: ${id}`);
  
  // Имитация задержки внешнего API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const hotel = mockHotels.find(h => h.id === id);
  if (hotel) {
    console.log(`✅ Found hotel: ${hotel.name}`);
    return hotel;
  } else {
    console.log(`❌ Hotel not found: ${id}`);
    return null;
  }
}

const resolvers = {
  Hotel: {
    __resolveReference: async ({ id }) => {
      // Federation: получение отеля по ID
      try {
        console.log(`🔍 __resolveReference for hotel ID: ${id}`);
        const hotel = await fetchHotelById(id);
        return hotel;
      } catch (error) {
        console.error(`❌ Error resolving hotel reference for ID ${id}:`, error);
        return null;
      }
    },
  },
  Query: {
    hotelsByIds: async (_, { ids }) => {
      // Получение нескольких отелей по ID
      try {
        console.log(`🔍 Fetching hotels by IDs: ${ids.join(', ')}`);
        
        const hotels = await Promise.all(
          ids.map(id => fetchHotelById(id))
        );
        
        const validHotels = hotels.filter(hotel => hotel !== null);
        console.log(`✅ Found ${validHotels.length} hotels`);
        
        return validHotels;
      } catch (error) {
        console.error(`❌ Error fetching hotels by IDs:`, error);
        return [];
      }
    },
    _entities: async (_, { representations }) => {
      // Federation: обработка _entities запроса
      console.log(`🔍 _entities query with representations:`, representations);
      
      const entities = await Promise.all(
        representations.map(async (rep) => {
          if (rep.__typename === 'Hotel') {
            const hotel = await fetchHotelById(rep.id);
            return hotel;
          }
          return null;
        })
      );
      
      return entities.filter(entity => entity !== null);
    },
    _service: () => {
      return { sdl: typeDefs.loc.source.body };
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, {
  listen: { port: 4002 },
}).then(() => {
  console.log('✅ Hotel subgraph ready at http://localhost:4002/');
});
