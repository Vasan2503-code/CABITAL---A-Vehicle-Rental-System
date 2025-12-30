package com.example.CabitalBackend.config;

import com.example.CabitalBackend.Model.Vehicle;
import com.example.CabitalBackend.Repo.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.logging.Logger;

@Configuration
public class DataSeeder {

    private static final Logger log = Logger.getLogger(DataSeeder.class.getName());

    @Bean
    CommandLineRunner seedVehicles(VehicleRepository vehicleRepository) {
        return args -> {
            if (vehicleRepository.count() > 0) {
                log.info("Vehicles already seeded. Count=" + vehicleRepository.count());
                return;
            }
            List<Vehicle> vehicles = List.of(
                    Vehicle.builder().make("Maruti").model("Dzire").type("Car").registrationNumber("TN01DZIRE1").basePricePerDay(1800).thumbnailUrl("https://imgd.aeplcdn.com/600x337/cw/ec/41785/Maruti-Suzuki-Dzire.jpg").location("Chennai").active(true).build(),
                    Vehicle.builder().make("Tata").model("Nexon").type("Car").registrationNumber("TN01NEXON1").basePricePerDay(2200).thumbnailUrl("https://imgd.aeplcdn.com/600x337/cw/ec/39043/Tata-Nexon.jpg").location("Bangalore").active(true).build(),
                    Vehicle.builder().make("Toyota").model("Innova Crysta").type("Van").registrationNumber("TN01INNOVA1").basePricePerDay(3200).thumbnailUrl("https://imgd.aeplcdn.com/600x337/cw/ec/41011/Toyota-Innova.jpg").location("Hyderabad").active(true).build(),
                    Vehicle.builder().make("Royal Enfield").model("Classic 350").type("Bikes").registrationNumber("TN01RE1").basePricePerDay(900).thumbnailUrl("https://imgd.aeplcdn.com/600x337/bw/models/royal-enfield-classic-350-right-front-three-quarter.jpeg").location("Chennai").active(true).build(),
                    Vehicle.builder().make("Tata").model("Ace Gold").type("carrier vehicles").registrationNumber("TN01ACE1").basePricePerDay(1500).thumbnailUrl("https://imgd.aeplcdn.com/600x337/cw/ec/37513/Tata-Ace-Gold.jpg").location("Chennai").active(true).build(),
                    Vehicle.builder().make("Kia").model("Seltos").type("Car").registrationNumber("TN01KIASEL1").basePricePerDay(2400).thumbnailUrl("https://imgd.aeplcdn.com/600x337/cw/ec/37743/Kia-Seltos.jpg").location("Chennai").active(true).build()
            );
            vehicleRepository.saveAll(vehicles);
            vehicleRepository.findAll().forEach(v -> log.info("Seeded vehicle: " + v.getType() + " " + v.getModel() + " @" + v.getLocation()));
        };
    }
}


