import { credentials } from '@grpc/grpc-js';

class BookingServiceClient {
  constructor(address, creds) {
    this.address = address;
    this.credentials = creds;
  }

  listBookings(request, callback) {
    // Моковые данные для тестирования
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
    
    setTimeout(() => {
      callback(null, mockResponse);
    }, 100);
  }
}

export { BookingServiceClient };
