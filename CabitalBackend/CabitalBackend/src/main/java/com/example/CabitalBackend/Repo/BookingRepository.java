package com.example.CabitalBackend.Repo;

import com.example.CabitalBackend.Model.Booking;
import com.example.CabitalBackend.Model.BookingStatus;
import com.example.CabitalBackend.Model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            select case when count(b) > 0 then true else false end
            from Booking b
            where b.vehicle = :vehicle
              and b.status = :status
              and b.startDateTime < :endDate
              and b.endDateTime > :startDate
            """)
    boolean existsConfirmedOverlap(@Param("vehicle") Vehicle vehicle,
                                   @Param("status") BookingStatus status,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    Optional<Booking> findByIdAndUserId(Long id, Long userId);
}


