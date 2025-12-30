package com.example.CabitalBackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record BookingRequest(
        @NotNull Long vehicleId,
        @NotBlank String pickupLocation,
        @NotBlank String dropLocation,
        @NotNull LocalDateTime startDateTime,
        @NotNull LocalDateTime endDateTime,
        @NotBlank String contactName,
        @NotBlank String contactPhone
) { }


