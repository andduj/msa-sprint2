package com.hotelio.bookingservice.grpc;

import com.hotelio.bookingservice.entity.Booking;
import com.hotelio.bookingservice.service.BookingService;
import com.hotelio.proto.booking.*;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.format.DateTimeFormatter;
import java.util.List;

@GrpcService
public class BookingGrpcService extends BookingServiceGrpc.BookingServiceImplBase {

    private final BookingService bookingService;

    @Autowired
    public BookingGrpcService(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Override
    public void createBooking(BookingRequest request, StreamObserver<BookingResponse> responseObserver) {
        try {
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

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }

    @Override
    public void listBookings(BookingListRequest request, StreamObserver<BookingListResponse> responseObserver) {
        try {
            List<Booking> bookings = bookingService.listAll(request.getUserId());
            
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

            responseObserver.onNext(responseBuilder.build());
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }
} 