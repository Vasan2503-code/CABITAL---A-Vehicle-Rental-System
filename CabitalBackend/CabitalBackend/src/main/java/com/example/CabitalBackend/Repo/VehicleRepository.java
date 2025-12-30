package com.example.CabitalBackend.Repo;

import com.example.CabitalBackend.Model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByTypeIgnoreCaseAndActiveTrue(String type);

    List<Vehicle> findByActiveTrue();

    @Query("""
            select v from Vehicle v
            where v.active = true
            and (:type is null or lower(v.type) = lower(:type))
            and (:location is null or lower(v.location) like lower(concat('%', :location, '%')))
            and not exists (
                select 1 from Booking b
                where b.vehicle = v
                and b.status = com.example.CabitalBackend.Model.BookingStatus.CONFIRMED
                and b.startDateTime < :endDate
                and b.endDateTime > :startDate
            )
            """)
    List<Vehicle> searchAvailable(@Param("type") String type,
                                  @Param("location") String location,
                                  @Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate);
}


