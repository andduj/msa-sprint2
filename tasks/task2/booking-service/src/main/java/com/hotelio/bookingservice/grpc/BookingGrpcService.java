package com.hotelio.bookingservice.grpc;

import com.hotelio.bookingservice.entity.Booking;
import com.hotelio.bookingservice.service.BookingService;
import com.hotelio.proto.booking.*;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.format.DateTimeFormatter;
import java.util.List;

@GrpcService
public class BookingGrpcService extends BookingServiceGrpc.BookingServiceImplBase {

    private static final Logger log = LoggerFactory.getLogger(BookingGrpcService.class);
    private final BookingService bookingService;

    @Autowired
    public BookingGrpcService(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Override
    public void createBooking(BookingRequest request, StreamObserver<BookingResponse> responseObserver) {
        try {
            log.info("gRPC createBooking called with userId: {}, hotelId: {}, promoCode: {}", 
                request.getUserId(), request.getHotelId(), request.getPromoCode());
            
            Booking booking = bookingService.createBooking(
                request.getUserId(),
                request.getHotelId(),
                request.getPromoCode()
            );

            BookingResponse response = BookingResponse.newBuilder()
                .setId(String.valueOf(booking.getId()))
                .setUserId(booking.getUserId())
                .setHotelId(booking.getHotelId())
                .setPromoCode(booking.getPromoCode() != null ? booking.getPromoCode() : "")
                .setDiscountPercent(booking.getDiscountPercent())
                .setPrice(booking.getPrice())
                .setCreatedAt(booking.getCreatedAt().toString())
                .build();

            log.info("gRPC createBooking response: {}", response);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            log.error("Error in createBooking gRPC call", e);
            responseObserver.onError(e);
        }
    }

    @Override
    public void listBookings(BookingListRequest request, StreamObserver<BookingListResponse> responseObserver) {
        try {
            String userId = request.getUserId();
            log.info("gRPC listBookings called with userId: '{}'", userId);
            
            List<Booking> bookings = bookingService.listAll(userId);
            log.info("Found {} bookings for userId: '{}'", bookings.size(), userId);
            
            for (Booking booking : bookings) {
                log.info("Booking: id={}, userId={}, hotelId={}, promoCode={}, discountPercent={}, price={}", 
                    booking.getId(), booking.getUserId(), booking.getHotelId(), 
                    booking.getPromoCode(), booking.getDiscountPercent(), booking.getPrice());
            }
            
            BookingListResponse.Builder responseBuilder = BookingListResponse.newBuilder();
            
            for (Booking booking : bookings) {
                BookingResponse bookingResponse = BookingResponse.newBuilder()
                    .setId(String.valueOf(booking.getId()))
                    .setUserId(booking.getUserId())
                    .setHotelId(booking.getHotelId())
                    .setPromoCode(booking.getPromoCode() != null ? booking.getPromoCode() : "")
                    .setDiscountPercent(booking.getDiscountPercent())
                    .setPrice(booking.getPrice())
                    .setCreatedAt(booking.getCreatedAt().toString())
                    .build();
                
                responseBuilder.addBookings(bookingResponse);
            }

            BookingListResponse response = responseBuilder.build();
            log.info("gRPC listBookings response contains {} bookings", response.getBookingsCount());
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            log.error("Error in listBookings gRPC call", e);
            responseObserver.onError(e);
        }
    }
} 