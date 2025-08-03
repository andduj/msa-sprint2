#!/bin/bash
set -euo pipefail

echo "🏁 Регрессионный тест Task 2: Миграция на микросервисы"

# Проверка соединения
echo "🧪 Проверка подключения к БД..."
timeout 2 bash -c "</dev/tcp/${DB_HOST}/${DB_PORT}" \
  || { echo "❌ Не удалось подключиться к ${DB_HOST}:${DB_PORT}"; exit 1; }

# Загрузка фикстур
echo "🧪 Загрузка фикстур..."
PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" "${DB_NAME}" < init-fixtures.sql

echo "🧪 Выполнение HTTP-тестов..."

pass() { echo "✅ $1"; }
fail() { echo "❌ $1"; exit 1; }

BASE="${API_URL:-http://localhost:8084}"

echo ""
echo "Тесты пользователей..."
# 1. Получение пользователя по ID
curl -sSf "${BASE}/api/users/test-user-1" | grep -q 'Alice' && pass "Получение test-user-1 по ID работает" || fail "Пользователь test-user-1 не найден"

# 2. Статус пользователя
curl -sSf "${BASE}/api/users/test-user-1/status" | grep -q 'ACTIVE' && pass "Статус test-user-1: ACTIVE" || fail "Неверный статус пользователя"

echo ""
echo "Тесты отелей..."
# 1. Получение отеля по ID
curl -sSf "${BASE}/api/hotels/test-hotel-1" | grep -q 'Seoul' && pass "test-hotel-1 получен по ID" || fail "test-hotel-1 не найден"

# 2. Проверка operational
curl -sSf "${BASE}/api/hotels/test-hotel-1/operational" | grep -q 'true' && pass "test-hotel-1 работает" || fail "test-hotel-1 не работает"

echo ""
echo "Тесты бронирований (через gRPC)..."
# 1. Успешное бронирование отеля без промо
curl -sSf -X POST "${BASE}/api/bookings?userId=test-user-3&hotelId=test-hotel-1" | grep -q 'test-hotel-1' && pass "Бронирование прошло (без промо)" || fail "Бронирование (без промо) не прошло"

# 2. Успешное бронирование с промо
curl -sSf -X POST "${BASE}/api/bookings?userId=test-user-2&hotelId=test-hotel-1&promoCode=TESTCODE1" | grep -q 'TESTCODE1' && pass "Бронирование с промо прошло" || fail "Бронирование с промо не прошло"

# 3. Ошибка — неактивный пользователь
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE}/api/bookings?userId=test-user-0&hotelId=test-hotel-1")
if [[ "$code" == "500" ]]; then
  pass "Отклонено: неактивный пользователь"
else
  fail "Ошибка: сервер принял бронирование от неактивного пользователя (код $code)"
fi

echo ""
echo "Тесты booking-history-service..."
# 1. Проверка API истории
curl -sSf "http://localhost:8085/api/history" | grep -q 'test-user-2' && pass "История бронирований получена" || fail "История бронирований не получена"

# 2. Проверка истории по пользователю
curl -sSf "http://localhost:8085/api/history/user/test-user-2" | grep -q 'test-user-2' && pass "История пользователя получена" || fail "История пользователя не получена"

echo ""
echo "Проверка Kafka событий..."
# Проверяем, что события отправляются в Kafka
docker exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic booking-created --from-beginning --max-messages 1 | grep -q 'bookingId' && pass "Kafka события отправляются" || fail "Kafka события не отправляются"

echo "✅ Все HTTP-тесты пройдены!"

echo ""
echo "📊 Сравнение данных в базах..."

echo "Монолит база данных:"
PGPASSWORD="hotelio" psql -h localhost -p 5432 -U hotelio -d hotelio -c "SELECT id, userid, hotelid, price FROM booking ORDER BY id;"

echo ""
echo "Booking Service база данных:"
PGPASSWORD="booking" psql -h localhost -p 5433 -U booking -d booking_service -c "SELECT id, userid, hotelid, price FROM bookings ORDER BY id;"

echo ""
echo "History Service база данных:"
PGPASSWORD="history" psql -h localhost -p 5434 -U history -d booking_history -c "SELECT id, bookingid, userid, hotelid, price FROM booking_history ORDER BY id;"

echo ""
echo "✅ Task 2 успешно завершен!" 