-- Инициализация тестовых данных для booking-service
-- Подключаемся к базе данных booking_service

-- Очищаем существующие данные
DELETE FROM bookings;

-- Вставляем тестовые бронирования
INSERT INTO bookings (user_id, hotel_id, promo_code, discount_percent, price, created_at) VALUES
('user1', 'hotel1', 'SUMMER2024', 15.0, 8500.0, NOW()),
('user1', 'hotel2', 'WINTER2024', 10.0, 6500.0, NOW()),
('user2', 'hotel1', NULL, 0.0, 10000.0, NOW()),
('user2', 'hotel3', 'SPRING2024', 20.0, 4500.0, NOW()),
('user3', 'hotel2', 'AUTUMN2024', 5.0, 7500.0, NOW());

-- Проверяем данные
SELECT * FROM bookings;
