package com.example.CabitalBackend.Service;

import com.example.CabitalBackend.Model.Vehicle;
import com.example.CabitalBackend.Repo.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> search(String type, String startDate, String startTime, String endDate, String endTime, String location) {
        if (startDate == null || startTime == null || endDate == null || endTime == null) {
            throw new IllegalArgumentException("Start and end date/time are required");
        }
        LocalDateTime start = LocalDateTime.of(LocalDate.parse(startDate), LocalTime.parse(startTime));
        LocalDateTime end = LocalDateTime.of(LocalDate.parse(endDate), LocalTime.parse(endTime));

        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        return vehicleRepository.searchAvailable(
                type != null && !type.isBlank() ? type : null,
                location != null && !location.isBlank() ? location : null,
                start,
                end
        );
    }

    public List<Vehicle> getByType(String type) {
        if (type == null || type.isBlank()) {
            return vehicleRepository.findByActiveTrue();
        }
        return vehicleRepository.findByTypeIgnoreCaseAndActiveTrue(type);
    }

    public Vehicle get(Long id) {
        return vehicleRepository.findById(id).orElse(null);
    }
}

