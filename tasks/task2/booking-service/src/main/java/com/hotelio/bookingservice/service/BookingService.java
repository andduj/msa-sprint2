package com.hotelio.bookingservice.service;

import com.hotelio.bookingservice.entity.Booking;
import com.hotelio.bookingservice.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);
    private static final String BOOKING_CREATED_TOPIC = "booking-created";

    private final BookingRepository bookingRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public BookingService(BookingRepository bookingRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.bookingRepository = bookingRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public List<Booking> listAll(String userId) {
        log.info("BookingService.listAll called with userId: '{}'", userId);
        List<Booking> result = userId != null ? bookingRepository.findByUserId(userId) : bookingRepository.findAll();
        log.info("BookingService.listAll found {} bookings for userId: '{}'", result.size(), userId);
        return result;
    }

    public Booking createBooking(String userId, String hotelId, String promoCode) {
        log.info("Creating booking: userId={}, hotelId={}, promoCode={}", userId, hotelId, promoCode);

        // Упрощенная логика для демонстрации
        double basePrice = 100.0;
        double discount = promoCode != null ? 10.0 : 0.0;
        double finalPrice = basePrice - discount;

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setHotelId(hotelId);
        booking.setPromoCode(promoCode);
        booking.setDiscountPercent(discount);
        booking.setPrice(finalPrice);
        booking.setCreatedAt(Instant.now());

        Booking savedBooking = bookingRepository.save(booking);

        // Отправляем событие в Kafka
        String event = String.format("{\"bookingId\":\"%d\",\"userId\":\"%s\",\"hotelId\":\"%s\",\"price\":%.2f,\"createdAt\":\"%s\"}",
                savedBooking.getId(), userId, hotelId, finalPrice, savedBooking.getCreatedAt());
        
        kafkaTemplate.send(BOOKING_CREATED_TOPIC, event);
        log.info("Sent booking event to Kafka: {}", event);

        return savedBooking;
    }
} 