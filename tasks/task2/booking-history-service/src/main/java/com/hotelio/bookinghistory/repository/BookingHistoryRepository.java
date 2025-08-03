package com.hotelio.bookinghistory.repository;

import com.hotelio.bookinghistory.entity.BookingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingHistoryRepository extends JpaRepository<BookingHistory, Long> {
    List<BookingHistory> findByUserId(String userId);
    List<BookingHistory> findByHotelId(String hotelId);
} 