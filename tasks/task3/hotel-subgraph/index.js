import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import { Pool } from 'pg';

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

// Подключение к PostgreSQL
const pool = new Pool({
  user: 'hotel',
  host: 'hotel-db',
  database: 'hotel_service',
  password: 'hotel',
  port: 5432,
});

// Приведение ID к числу: поддержка значений вида "hotel1" → 1
function normalizeHotelId(rawId) {
  const idString = String(rawId ?? '');
  const onlyDigits = idString.replace(/\D+/g, '');
  return Number.parseInt(onlyDigits || '0', 10);
}

// Функция для получения отеля по ID из базы данных
async function fetchHotelById(id) {
  console.log(`Fetching hotel by ID: ${id}`);
  const numericId = normalizeHotelId(id);
  
  try {
    const query = 'SELECT id, name, city, stars FROM hotels WHERE id = $1';
    const result = await pool.query(query, [numericId]);
    
    if (result.rows.length > 0) {
      const hotel = result.rows[0];
      console.log(`Found hotel: ${hotel.name}`);
      return {
        id: hotel.id.toString(),
        name: hotel.name,
        city: hotel.city,
        stars: hotel.stars
      };
    } else {
      console.log(`Hotel not found: ${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching hotel ${id}:`, error);
    return null;
  }
}

// Функция для получения отелей по ID из базы данных
async function fetchHotelsByIds(ids) {
  console.log(`Fetching hotels by IDs: ${ids.join(', ')}`);
  const numericIds = ids.map(normalizeHotelId).filter((n) => Number.isFinite(n) && n > 0);
  
  try {
    const query = 'SELECT id, name, city, stars FROM hotels WHERE id = ANY($1)';
    const result = await pool.query(query, [numericIds]);
    
    const hotels = result.rows.map(hotel => ({
      id: hotel.id.toString(),
      name: hotel.name,
      city: hotel.city,
      stars: hotel.stars
    }));
    
    console.log(`Found ${hotels.length} hotels:`, hotels);
    return hotels;
  } catch (error) {
    console.error(`Error fetching hotels by IDs:`, error);
    return [];
  }
}

const resolvers = {
  Hotel: {
    __resolveReference: async ({ id }) => {
      console.log(`__resolveReference for hotel ID: ${id}`);
      const hotel = await fetchHotelById(id);
      console.log(`__resolveReference result for ${id}:`, hotel);
      return hotel;
    }
  },
  Query: {
    hotelsByIds: async (_, { ids }) => {
      return await fetchHotelsByIds(ids);
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
