package com.example.CabitalBackend.dto;

import jakarta.validation.constraints.NotNull;

public record PaymentRequest(
        @NotNull Long bookingId,
        @NotNull Double amount
) { }


