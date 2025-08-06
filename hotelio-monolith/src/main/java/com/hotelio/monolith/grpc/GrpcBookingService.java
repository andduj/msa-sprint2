package com.hotelio.monolith.grpc;

import com.hotelio.monolith.entity.Booking;
import com.hotelio.proto.booking.*;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service("monolithGrpcBookingService")
public class GrpcBookingService {

    private static final Logger log = LoggerFactory.getLogger(GrpcBookingService.class);

    @Value("${booking.service.external.host:booking-service}")
    private String bookingServiceHost;

    @Value("${booking.service.external.port:9090}")
    private int bookingServicePort;

    private ManagedChannel channel;
    private BookingServiceGrpc.BookingServiceBlockingStub stub;
    private boolean initialized = false;

    private synchronized void initializeGrpcClient() {
        if (initialized) {
            return;
        }
        
        try {
            channel = ManagedChannelBuilder.forAddress(bookingServiceHost, bookingServicePort)
                    .usePlaintext()
                    .build();
            stub = BookingServiceGrpc.newBlockingStub(channel);
            log.info("gRPC client initialized for {}:{}", bookingServiceHost, bookingServicePort);
            initialized = true;
        } catch (Exception e) {
            log.warn("Failed to initialize gRPC client for {}:{}. Will retry on first use. Error: {}", 
                    bookingServiceHost, bookingServicePort, e.getMessage());
        }
    }

    public Booking createBooking(String userId, String hotelId, String promoCode) {
        initializeGrpcClient();
        
        if (stub == null) {
            throw new RuntimeException("gRPC client not available. External booking service is not reachable.");
        }
        
        try {
            BookingRequest request = BookingRequest.newBuilder()
                    .setUserId(userId)
                    .setHotelId(hotelId)
                    .setPromoCode(promoCode != null ? promoCode : "")
                    .build();

            BookingResponse response = stub.createBooking(request);
            
            Booking booking = new Booking();
            booking.setId(Long.parseLong(response.getId()));
            booking.setUserId(response.getUserId());
            booking.setHotelId(response.getHotelId());
            booking.setPromoCode(response.getPromoCode());
            booking.setDiscountPercent(response.getDiscountPercent());
            booking.setPrice(response.getPrice());
            booking.setCreatedAt(Instant.parse(response.getCreatedAt()));
            
            log.info("Created booking via gRPC: {}", booking.getId());
            return booking;
        } catch (Exception e) {
            log.error("Error creating booking via gRPC: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create booking via gRPC", e);
        }
    }

    public List<Booking> listBookings(String userId) {
        initializeGrpcClient();
        
        if (stub == null) {
            throw new RuntimeException("gRPC client not available. External booking service is not reachable.");
        }
        
        try {
            BookingListRequest.Builder requestBuilder = BookingListRequest.newBuilder();
            if (userId != null && !userId.trim().isEmpty()) {
                requestBuilder.setUserId(userId);
            }
            BookingListRequest request = requestBuilder.build();

            BookingListResponse response = stub.listBookings(request);
            
            return response.getBookingsList().stream()
                    .map(this::mapToBooking)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error listing bookings via gRPC: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to list bookings via gRPC", e);
        }
    }

    private Booking mapToBooking(BookingResponse response) {
        Booking booking = new Booking();
        booking.setId(Long.parseLong(response.getId()));
        booking.setUserId(response.getUserId());
        booking.setHotelId(response.getHotelId());
        booking.setPromoCode(response.getPromoCode());
        booking.setDiscountPercent(response.getDiscountPercent());
        booking.setPrice(response.getPrice());
        booking.setCreatedAt(Instant.parse(response.getCreatedAt()));
        return booking;
    }
} 