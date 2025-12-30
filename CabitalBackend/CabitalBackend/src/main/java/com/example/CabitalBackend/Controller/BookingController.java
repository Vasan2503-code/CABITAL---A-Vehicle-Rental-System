package com.example.CabitalBackend.Controller;

import com.example.CabitalBackend.Model.Booking;
import com.example.CabitalBackend.Model.User;
import com.example.CabitalBackend.Service.BookingService;
import com.example.CabitalBackend.dto.BookingRequest;
import com.example.CabitalBackend.dto.BookingResponse;
import com.example.CabitalBackend.dto.PaymentConfirmRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@AuthenticationPrincipal User user,
                                                         @Valid @RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(
                user.getId(),
                request.vehicleId(),
                request.pickupLocation(),
                request.dropLocation(),
                request.startDateTime(),
                request.endDateTime(),
                request.contactName(),
                request.contactPhone()
        );
        return ResponseEntity.ok(toResponse(booking));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@AuthenticationPrincipal User user,
                                                      @PathVariable Long id) {
        Booking booking = bookingService.getBookingForUser(id, user.getId());
        return ResponseEntity.ok(toResponse(booking));
    }

    @PostMapping("/{id}/confirm-payment")
    public ResponseEntity<BookingResponse> confirmPayment(@AuthenticationPrincipal User user,
                                                          @PathVariable Long id,
                                                          @Valid @RequestBody PaymentConfirmRequest request) {
        Booking booking = bookingService.confirmPayment(id, user.getId(), request.paymentReference());
        return ResponseEntity.ok(toResponse(booking));
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getVehicle().getMake(),
                booking.getVehicle().getModel(),
                booking.getVehicle().getType(),
                booking.getPickupLocation(),
                booking.getDropLocation(),
                booking.getStartDateTime(),
                booking.getEndDateTime(),
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getPaymentReference()
        );
    }
}


