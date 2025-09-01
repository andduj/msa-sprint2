package com.hotelio.bookingservice;

import com.hotelio.bookingservice.entity.Booking;
import com.hotelio.bookingservice.repository.BookingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.Instant;

@SpringBootApplication
public class BookingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookingServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(BookingRepository bookingRepository) {
        return args -> {
            // Проверяем, есть ли уже данные
            if (bookingRepository.count() == 0) {
                System.out.println("Initializing test data for booking service...");
                
                // Создаем тестовые бронирования
                Booking booking1 = new Booking();
                booking1.setUserId("user1");
                booking1.setHotelId("hotel1");
                booking1.setPromoCode("SUMMER2024");
                booking1.setDiscountPercent(10.0);
                booking1.setPrice(90.0);
                booking1.setCreatedAt(Instant.now());
                bookingRepository.save(booking1);

                Booking booking2 = new Booking();
                booking2.setUserId("user1");
                booking2.setHotelId("hotel2");
                booking2.setPromoCode(null);
                booking2.setDiscountPercent(0.0);
                booking2.setPrice(100.0);
                booking2.setCreatedAt(Instant.now());
                bookingRepository.save(booking2);

                Booking booking3 = new Booking();
                booking3.setUserId("user2");
                booking3.setHotelId("hotel1");
                booking3.setPromoCode("WINTER2024");
                booking3.setDiscountPercent(15.0);
                booking3.setPrice(85.0);
                booking3.setCreatedAt(Instant.now());
                bookingRepository.save(booking3);

                System.out.println("Test data initialized successfully!");
            }
        };
    }
} 