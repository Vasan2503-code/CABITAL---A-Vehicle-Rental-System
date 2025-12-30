package com.example.CabitalBackend.Controller;

import com.example.CabitalBackend.Model.User;
import com.example.CabitalBackend.Service.PaymentService;
import com.example.CabitalBackend.dto.PaymentRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/qr")
    public ResponseEntity<PaymentService.PaymentPayload> generateQr(@AuthenticationPrincipal User user,
                                                                    @Valid @RequestBody PaymentRequest request) {
        var payload = paymentService.generatePaymentPayload(user.getId(), request.bookingId(), request.amount());
        return ResponseEntity.ok(payload);
    }
}


