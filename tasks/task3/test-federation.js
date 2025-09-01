import fetch from 'node-fetch';

const GATEWAY_URL = 'http://localhost:4000/graphql';
const BOOKING_SUBGRAPH_URL = 'http://localhost:4001/graphql';
const HOTEL_SUBGRAPH_URL = 'http://localhost:4002/graphql';

// Тестовый запрос для проверки Federation
const testFederationQuery = `
  query TestFederation($userId: String!) {
    bookingsByUser(userId: $userId) {
      id
      userId
      hotelId
      promoCode
      discountPercent
      hotel {
        id
        name
        city
        stars
      }
    }
  }
`;

// Тест introspection для Gateway
const introspectionQuery = `
  query IntrospectionQuery {
    __schema {
      types {
        name
        fields {
          name
          type {
            name
          }
        }
      }
    }
  }
`;

async function testIntrospection(url, name) {
  try {
    console.log(`🔍 Testing introspection for ${name}...`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: introspectionQuery
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log(`❌ ${name} introspection errors:`, result.errors);
    } else {
      console.log(`✅ ${name} introspection successful`);
      const types = result.data.__schema.types.filter(t => t.name && !t.name.startsWith('__'));
      console.log(`📋 ${name} types:`, types.map(t => t.name));
    }
  } catch (error) {
    console.error(`❌ ${name} introspection error:`, error.message);
  }
}

async function testFederation() {
  console.log('🧪 Testing Federation between booking-subgraph and hotel-subgraph...\n');

  try {
    // Сначала тестируем introspection
    await testIntrospection(GATEWAY_URL, 'Gateway');
    await testIntrospection(BOOKING_SUBGRAPH_URL, 'Booking Subgraph');
    await testIntrospection(HOTEL_SUBGRAPH_URL, 'Hotel Subgraph');
    
    console.log('\n📡 Sending Federation query to Gateway...');
    
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: testFederationQuery,
        variables: { userId: 'user1' }
      })
    });

    const result = await response.json();
    
    console.log('📊 Gateway Response:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.errors) {
      console.log('\n❌ Federation errors found:');
      result.errors.forEach(error => {
        console.log(`  - ${error.message}`);
        if (error.extensions) {
          console.log(`    Extensions:`, error.extensions);
        }
      });
    } else if (result.data) {
      console.log('\n✅ Federation working!');
      const bookings = result.data.bookingsByUser;
      console.log(`📋 Found ${bookings.length} bookings`);
      
      bookings.forEach(booking => {
        console.log(`\n🏨 Booking ${booking.id}:`);
        console.log(`  - User: ${booking.userId}`);
        console.log(`  - Hotel: ${booking.hotel?.name || 'Unknown'} (${booking.hotel?.city || 'Unknown'})`);
        console.log(`  - Stars: ${booking.hotel?.stars || 'Unknown'}`);
        console.log(`  - Promo: ${booking.promoCode || 'None'}`);
        console.log(`  - Discount: ${booking.discountPercent || 0}%`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing Federation:', error);
  }
}

// Тестируем отдельные подграфы
async function testIndividualSubgraphs() {
  console.log('\n🔍 Testing individual subgraphs...\n');
  
  // Тест booking-subgraph
  try {
    console.log('📡 Testing booking-subgraph...');
    const bookingResponse = await fetch(BOOKING_SUBGRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query TestBooking($userId: String!) {
            bookingsByUser(userId: $userId) {
              id
              userId
              hotelId
              promoCode
              discountPercent
              hotel {
                id
              }
            }
          }
        `,
        variables: { userId: 'user1' }
      })
    });
    
    const bookingResult = await bookingResponse.json();
    console.log('✅ Booking subgraph response:', JSON.stringify(bookingResult, null, 2));
  } catch (error) {
    console.error('❌ Booking subgraph error:', error);
  }
  
  // Тест hotel-subgraph
  try {
    console.log('\n📡 Testing hotel-subgraph...');
    const hotelResponse = await fetch(HOTEL_SUBGRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query TestHotel($ids: [ID!]!) {
            hotelsByIds(ids: $ids) {
              id
              name
              city
              stars
            }
          }
        `,
        variables: { ids: ['hotel1', 'hotel2'] }
      })
    });
    
    const hotelResult = await hotelResponse.json();
    console.log('✅ Hotel subgraph response:', JSON.stringify(hotelResult, null, 2));
  } catch (error) {
    console.error('❌ Hotel subgraph error:', error);
  }
}

// Запускаем тесты
async function runTests() {
  await testIndividualSubgraphs();
  await testFederation();
}

runTests().catch(console.error);
