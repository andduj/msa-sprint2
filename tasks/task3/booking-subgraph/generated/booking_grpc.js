import { loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем proto файл
const PROTO_PATH = join(__dirname, '../booking.proto');
const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const bookingProto = loadPackageDefinition(packageDefinition);

// Реальный gRPC клиент
class BookingServiceClient {
  constructor(address, creds) {
    this.client = new bookingProto.booking.BookingService(
      address,
      creds
    );
    console.log(`Initializing gRPC client for ${address}`);
  }

  listBookings(request, callback) {
    console.log(`Making gRPC call to ${this.client.target} for listBookings`);
    console.log('Request userId:', request.getUserId());
    
    this.client.listBookings(request, (error, response) => {
      if (error) {
        console.error('gRPC call failed:', error);
        callback(error, null);
      } else {
        console.log('Real gRPC Response received');
        console.log('Response structure:', Object.keys(response));
        console.log('Response bookings:', response.bookings);
        callback(null, response);
      }
    });
  }

  createBooking(request, callback) {
    console.log(`Making gRPC call to ${this.client.target} for createBooking`);
    console.log('Request:', request);
    
    this.client.createBooking(request, (error, response) => {
      if (error) {
        console.error('gRPC call failed:', error);
        callback(error, null);
      } else {
        console.log('Real gRPC Response received');
        callback(null, response);
      }
    });
  }
}

export { BookingServiceClient };
