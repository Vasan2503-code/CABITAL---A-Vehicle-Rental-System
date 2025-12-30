package com.example.CabitalBackend.dto;

import jakarta.validation.constraints.NotBlank;

public record PaymentConfirmRequest(
        @NotBlank String paymentReference
) { }


