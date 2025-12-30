package com.example.CabitalBackend.dto;

import com.example.CabitalBackend.Model.BookingStatus;

import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        String vehicleMake,
        String vehicleModel,
        String vehicleType,
        String pickupLocation,
        String dropLocation,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        double totalPrice,
        BookingStatus status,
        String paymentReference
) { }


