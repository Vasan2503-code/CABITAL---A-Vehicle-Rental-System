package com.example.CabitalBackend.Service;

import com.example.CabitalBackend.Model.*;
import com.example.CabitalBackend.Repo.BookingRepository;
import com.example.CabitalBackend.Repo.UserRepository;
import com.example.CabitalBackend.Repo.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Booking createBooking(Long userId,
                                 Long vehicleId,
                                 String pickupLocation,
                                 String dropLocation,
                                 LocalDateTime startDateTime,
                                 LocalDateTime endDateTime,
                                 String contactName,
                                 String contactPhone) {
        if (!endDateTime.isAfter(startDateTime)) {
            throw new IllegalArgumentException("End date/time must be after start date/time");
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        if (bookingRepository.existsConfirmedOverlap(vehicle, BookingStatus.CONFIRMED, startDateTime, endDateTime)) {
            throw new IllegalStateException("Vehicle not available for selected time");
        }

        double totalPrice = calculatePrice(vehicle.getBasePricePerDay(), startDateTime, endDateTime);

        Booking booking = Booking.builder()
                .user(user)
                .vehicle(vehicle)
                .pickupLocation(pickupLocation)
                .dropLocation(dropLocation)
                .startDateTime(startDateTime)
                .endDateTime(endDateTime)
                .contactName(contactName)
                .contactPhone(contactPhone)
                .totalPrice(totalPrice)
                .status(BookingStatus.PENDING_PAYMENT)
                .createdAt(LocalDateTime.now())
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public Booking getBookingForUser(Long bookingId, Long userId) {
        return bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    @Transactional
    public Booking confirmPayment(Long bookingId, Long userId, String paymentReference) {
        Booking booking = getBookingForUser(bookingId, userId);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentReference(paymentReference);
        return bookingRepository.save(booking);
    }

    private double calculatePrice(double basePricePerDay, LocalDateTime start, LocalDateTime end) {
        long hours = ChronoUnit.HOURS.between(start, end);
        long days = (long) Math.ceil(Math.max(hours, 24) / 24.0);
        return days * basePricePerDay;
    }
}

