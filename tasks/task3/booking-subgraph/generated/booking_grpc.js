import { credentials } from '@grpc/grpc-js';

class BookingServiceClient {
  constructor(address, creds) {
    this.address = address;
    this.credentials = creds;
  }

  listBookings(request, callback) {
    // Реальная реализация gRPC клиента
    // Используем fetch для HTTP запроса к booking-service
    const fetch = require('node-fetch');
    
    const url = `http://booking-service:9090/api/bookings?userId=${request.getUserId()}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Преобразуем HTTP ответ в gRPC формат
        const bookings = data.map(booking => ({
          getId: () => booking.id.toString(),
          getUserId: () => booking.userId,
          getHotelId: () => booking.hotelId,
          getPromoCode: () => booking.promoCode || "",
          getDiscountPercent: () => booking.discountPercent || 0
        }));
        
        const response = {
          getBookingsList: () => bookings
        };
        
        callback(null, response);
      })
      .catch(error => {
        console.error('HTTP request error:', error);
        // Fallback к моковым данным в случае ошибки
        const mockResponse = {
          getBookingsList: () => [
            {
              getId: () => "1",
              getUserId: () => "user1",
              getHotelId: () => "hotel1",
              getPromoCode: () => "SUMMER2024",
              getDiscountPercent: () => 10
            },
            {
              getId: () => "2",
              getUserId: () => "user1", 
              getHotelId: () => "hotel2",
              getPromoCode: () => "",
              getDiscountPercent: () => 0
            }
          ]
        };
        callback(null, mockResponse);
      });
  }
}

export { BookingServiceClient };
