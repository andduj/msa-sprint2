import fetch from 'node-fetch';

async function testRealData() {
  console.log('Testing Federation with real data...\n');

  // Тест 1: Проверяем booking-subgraph напрямую
  console.log('1. Testing booking-subgraph directly...');
  try {
    const bookingResponse = await fetch('http://localhost:4001/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            bookingsByUser(userId: "user1") {
              id
              userId
              hotelId
              promoCode
              discountPercent
            }
          }
        `
      })
    });

    const bookingData = await bookingResponse.json();
    console.log('Booking-subgraph response:', JSON.stringify(bookingData, null, 2));
  } catch (error) {
    console.error('Booking-subgraph error:', error);
  }

  console.log('\n2. Testing Federation Gateway...');
  try {
    const federationResponse = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            bookingsByUser(userId: "user1") {
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
        `
      })
    });

    const federationData = await federationResponse.json();
    console.log('Federation response:', JSON.stringify(federationData, null, 2));
  } catch (error) {
    console.error('Federation error:', error);
  }

  console.log('\n3. Testing hotel-subgraph directly...');
  try {
    const hotelResponse = await fetch('http://localhost:4002/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            hotelsByIds(ids: ["1", "2"]) {
              id
              name
              city
              stars
            }
          }
        `
      })
    });

    const hotelData = await hotelResponse.json();
    console.log('Hotel-subgraph response:', JSON.stringify(hotelData, null, 2));
  } catch (error) {
    console.error('Hotel-subgraph error:', error);
  }

  console.log('\nTest completed!');
}

testRealData().catch(console.error);
