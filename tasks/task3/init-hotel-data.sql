-- Создание таблицы отелей
CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    stars INTEGER NOT NULL
);

-- Вставка тестовых данных
INSERT INTO hotels (id, name, city, stars) VALUES 
    (1, 'Grand Hotel', 'Moscow', 5),
    (2, 'Business Inn', 'St. Petersburg', 4),
    (3, 'Comfort Hotel', 'Kazan', 3),
    (4, 'Luxury Resort', 'Sochi', 5),
    (5, 'City Center Hotel', 'Novosibirsk', 4),
    (6, 'Airport Hotel', 'Yekaterinburg', 3),
    (7, 'Historic Hotel', 'Nizhny Novgorod', 4),
    (8, 'Spa Resort', 'Krasnodar', 5),
    (9, 'Business Center Hotel', 'Samara', 4),
    (10, 'Tourist Hotel', 'Rostov-on-Don', 3)
ON CONFLICT (id) DO NOTHING;
