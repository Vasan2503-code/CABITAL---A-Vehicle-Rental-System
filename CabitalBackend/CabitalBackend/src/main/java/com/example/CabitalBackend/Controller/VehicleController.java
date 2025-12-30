package com.example.CabitalBackend.Controller;

import com.example.CabitalBackend.Service.VehicleService;
import com.example.CabitalBackend.dto.VehicleResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<VehicleResponse>> search(
            @RequestParam String type,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String endTime,
            @RequestParam(required = false) String location) {
        List<VehicleResponse> vehicles;
        
        // If date/time parameters are provided, search for available vehicles in that timeframe
        if (startDate != null && startTime != null && endDate != null && endTime != null) {
            vehicles = vehicleService.search(type, startDate, startTime, endDate, endTime, location)
                    .stream()
                    .map(VehicleResponse::from)
                    .collect(Collectors.toList());
        } else {
            // Otherwise, just return all active vehicles of the type
            vehicles = vehicleService.getByType(type)
                    .stream()
                    .map(VehicleResponse::from)
                    .collect(Collectors.toList());
        }
        
        return ResponseEntity.ok(vehicles);
    }
}


