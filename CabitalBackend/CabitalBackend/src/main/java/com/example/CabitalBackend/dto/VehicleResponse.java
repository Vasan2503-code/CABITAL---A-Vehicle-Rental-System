package com.example.CabitalBackend.dto;

import com.example.CabitalBackend.Model.Vehicle;

public record VehicleResponse(
        Long id,
        String make,
        String model,
        String type,
        double basePricePerDay,
        String thumbnailUrl,
        String location
) {
    public static VehicleResponse from(Vehicle v) {
        return new VehicleResponse(
                v.getId(),
                v.getMake(),
                v.getModel(),
                v.getType(),
                v.getBasePricePerDay(),
                v.getThumbnailUrl(),
                v.getLocation()
        );
    }
}


