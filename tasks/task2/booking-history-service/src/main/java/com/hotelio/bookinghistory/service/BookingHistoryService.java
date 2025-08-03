package com.hotelio.bookinghistory.service;

import com.hotelio.bookinghistory.entity.BookingHistory;
import com.hotelio.bookinghistory.repository.BookingHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class BookingHistoryService {

    private static final Logger log = LoggerFactory.getLogger(BookingHistoryService.class);

    private final BookingHistoryRepository repository;

    @Autowired
    public BookingHistoryService(BookingHistoryRepository repository) {
        this.repository = repository;
    }

    @KafkaListener(topics = "booking-created", groupId = "booking-history-service")
    public void handleBookingCreated(String event) {
        log.info("Received booking event: {}", event);
        
        try {
            // Парсим JSON событие (упрощенно)
            BookingHistory history = parseBookingEvent(event);
            history.setProcessedAt(Instant.now());
            
            repository.save(history);
            log.info("Saved booking history: {}", history.getBookingId());
        } catch (Exception e) {
            log.error("Error processing booking event: {}", event, e);
        }
    }

    private BookingHistory parseBookingEvent(String event) {
        // Упрощенный парсинг JSON для демонстрации
        // В реальном проекте использовали бы Jackson или Gson
        
        BookingHistory history = new BookingHistory();
        
        // Извлекаем данные из JSON строки
        if (event.contains("\"bookingId\":")) {
            String bookingId = extractValue(event, "bookingId");
            history.setBookingId(bookingId);
        }
        
        if (event.contains("\"userId\":")) {
            String userId = extractValue(event, "userId");
            history.setUserId(userId);
        }
        
        if (event.contains("\"hotelId\":")) {
            String hotelId = extractValue(event, "hotelId");
            history.setHotelId(hotelId);
        }
        
        if (event.contains("\"price\":")) {
            String priceStr = extractValue(event, "price");
            try {
                history.setPrice(Double.parseDouble(priceStr));
            } catch (NumberFormatException e) {
                history.setPrice(0.0);
            }
        }
        
        if (event.contains("\"createdAt\":")) {
            String createdAtStr = extractValue(event, "createdAt");
            try {
                history.setCreatedAt(Instant.parse(createdAtStr));
            } catch (Exception e) {
                history.setCreatedAt(Instant.now());
            }
        }
        
        return history;
    }

    private String extractValue(String json, String key) {
        String pattern = "\"" + key + "\":\"";
        int start = json.indexOf(pattern);
        if (start == -1) {
            pattern = "\"" + key + "\":";
            start = json.indexOf(pattern);
            if (start == -1) return "";
            start += pattern.length();
            int end = json.indexOf(",", start);
            if (end == -1) end = json.indexOf("}", start);
            return json.substring(start, end).trim();
        }
        
        start += pattern.length();
        int end = json.indexOf("\"", start);
        return json.substring(start, end);
    }

    public List<BookingHistory> getAllHistory() {
        return repository.findAll();
    }

    public List<BookingHistory> getHistoryByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public List<BookingHistory> getHistoryByHotelId(String hotelId) {
        return repository.findByHotelId(hotelId);
    }
} 