-- Инициализация схемы и тестовых данных для booking-service
-- Скрипт запускается при первом старте контейнера booking-db

-- Создаем таблицу, если она отсутствует (схема согласована с JPA сущностью)
CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    hotel_id VARCHAR(255),
    promo_code VARCHAR(255),
    discount_percent DOUBLE PRECISION,
    price DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP
);

-- Очищаем и наполняем данными
TRUNCATE TABLE bookings RESTART IDENTITY;

INSERT INTO bookings (user_id, hotel_id, promo_code, discount_percent, price, created_at) VALUES
('user1', 'hotel1', 'SUMMER2024', 10.0, 90.0, NOW()),
('user1', 'hotel2', NULL, 0.0, 100.0, NOW()),
('user2', 'hotel1', 'WINTER2024', 15.0, 85.0, NOW());

-- Проверка
SELECT id, user_id, hotel_id, promo_code, discount_percent, price, created_at FROM bookings;
