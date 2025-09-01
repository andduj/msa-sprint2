package com.hotelio.monolith.controller;

import com.hotelio.monolith.entity.AppUser;
import com.hotelio.monolith.entity.Hotel;
import com.hotelio.monolith.repository.AppUserRepository;
import com.hotelio.monolith.repository.HotelRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestDataController {

    private final AppUserRepository userRepository;
    private final HotelRepository hotelRepository;

    public TestDataController(AppUserRepository userRepository, HotelRepository hotelRepository) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
    }

    @GetMapping("/init")
    public ResponseEntity<String> initializeTestData() {
        // Создаем тестовых пользователей из fixtures
        AppUser user1 = new AppUser();
        user1.setId("test-user-1");
        user1.setName("Alice");
        user1.setEmail("alice@test.com");
        user1.setCity("Seoul");
        user1.setStatus("ACTIVE");
        user1.setActive(true);
        user1.setBlacklisted(true);
        userRepository.save(user1);

        AppUser user2 = new AppUser();
        user2.setId("test-user-2");
        user2.setName("Bob");
        user2.setEmail("bob@test.com");
        user2.setCity("Busan");
        user2.setStatus("ACTIVE");
        user2.setActive(true);
        user2.setBlacklisted(false);
        userRepository.save(user2);

        AppUser user3 = new AppUser();
        user3.setId("test-user-3");
        user3.setName("Clara");
        user3.setEmail("clara@test.com");
        user3.setCity("Daegu");
        user3.setStatus("VIP");
        user3.setActive(true);
        user3.setBlacklisted(false);
        userRepository.save(user3);

        AppUser user4 = new AppUser();
        user4.setId("test-user-0");
        user4.setName("Zoe");
        user4.setEmail("zoe@test.com");
        user4.setCity("Jeju");
        user4.setStatus("ACTIVE");
        user4.setActive(false);
        user4.setBlacklisted(false);
        userRepository.save(user4);

        // Создаем тестовые отели из fixtures
        Hotel hotel1 = new Hotel();
        hotel1.setId("test-hotel-1");
        hotel1.setCity("Seoul");
        hotel1.setDescription("Modern hotel in Seoul downtown with spa and skybar.");
        hotel1.setRating(4.7);
        hotel1.setOperational(true);
        hotel1.setFullyBooked(false);
        hotelRepository.save(hotel1);

        Hotel hotel2 = new Hotel();
        hotel2.setId("test-hotel-2");
        hotel2.setCity("Busan");
        hotel2.setDescription("Luxury beach resort in Busan with ocean view.");
        hotel2.setRating(4.5);
        hotel2.setOperational(true);
        hotel2.setFullyBooked(true);
        hotelRepository.save(hotel2);

        Hotel hotel3 = new Hotel();
        hotel3.setId("test-hotel-3");
        hotel3.setCity("Daegu");
        hotel3.setDescription("Affordable business hotel in Daegu center.");
        hotel3.setRating(3.8);
        hotel3.setOperational(false);
        hotel3.setFullyBooked(false);
        hotelRepository.save(hotel3);

        return ResponseEntity.ok("Test data initialized successfully! Created 4 users and 3 hotels from fixtures.");
    }
} 