import { credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { loadPackageDefinition } from '@grpc/grpc-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем proto файл
const PROTO_PATH = join(__dirname, 'booking.proto');
const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const bookingProto = loadPackageDefinition(packageDefinition);

// Создаем gRPC клиент
const client = new bookingProto.booking.BookingService(
  'booking-service:9090',
  credentials.createInsecure()
);

// Создаем тестовый запрос
const request = {
  userId: 'user2'
};

console.log('Testing direct gRPC connection to booking-service...');
console.log('Request:', request);

client.listBookings(request, (error, response) => {
  if (error) {
    console.error('gRPC call failed:', error);
  } else {
    console.log('gRPC Response received');
    console.log('Response:', response);
    console.log('Response bookings:', response.bookings);
    console.log('Response bookings length:', response.bookings ? response.bookings.length : 'undefined');
  }
});
