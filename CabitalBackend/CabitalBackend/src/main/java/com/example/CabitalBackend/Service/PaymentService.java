package com.example.CabitalBackend.Service;

import com.example.CabitalBackend.Model.Booking;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
public class PaymentService {

    private final BookingService bookingService;

    public PaymentService(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    public PaymentPayload generatePaymentPayload(Long userId, Long bookingId, double amount) {
        Booking booking = bookingService.getBookingForUser(bookingId, userId);
        String upiPayload = String.format(
                "upi://pay?pa=cabital@upi&pn=CABITAL&am=%.2f&cu=INR&tn=Cabital booking %d",
                amount, booking.getId()
        );
        String qrBase64 = buildQrBase64(upiPayload);
        return new PaymentPayload(upiPayload, qrBase64);
    }

    public static class PaymentPayload {
        public final String paymentPayload;
        public final String qrBase64;

        public PaymentPayload(String paymentPayload, String qrBase64) {
            this.paymentPayload = paymentPayload;
            this.qrBase64 = qrBase64;
        }
    }

    public String autoPaymentReference() {
        return "UPI-" + UUID.randomUUID();
    }

    private String buildQrBase64(String payload) {
        QRCodeWriter writer = new QRCodeWriter();
        try {
            BitMatrix matrix = writer.encode(payload, BarcodeFormat.QR_CODE, 250, 250);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR", e);
        }
    }
}

