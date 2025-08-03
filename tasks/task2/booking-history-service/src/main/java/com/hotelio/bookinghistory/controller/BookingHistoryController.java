package com.hotelio.bookinghistory.controller;

import com.hotelio.bookinghistory.entity.BookingHistory;
import com.hotelio.bookinghistory.service.BookingHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class BookingHistoryController {

    private final BookingHistoryService historyService;

    @Autowired
    public BookingHistoryController(BookingHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public List<BookingHistory> getAllHistory() {
        return historyService.getAllHistory();
    }

    @GetMapping("/user/{userId}")
    public List<BookingHistory> getHistoryByUserId(@PathVariable String userId) {
        return historyService.getHistoryByUserId(userId);
    }

    @GetMapping("/hotel/{hotelId}")
    public List<BookingHistory> getHistoryByHotelId(@PathVariable String hotelId) {
        return historyService.getHistoryByHotelId(hotelId);
    }
} 