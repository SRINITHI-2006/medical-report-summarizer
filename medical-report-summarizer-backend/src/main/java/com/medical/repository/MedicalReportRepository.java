package com.medical.repository;

import com.medical.entity.MedicalReport;
import com.medical.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {

    Page<MedicalReport> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    Optional<MedicalReport> findByIdAndUser(Long id, User user);

    long countByUser(User user);

    @Query("""
            SELECT r FROM MedicalReport r
            LEFT JOIN FETCH r.summary
            WHERE r.user = :user
            AND (:patientName IS NULL OR LOWER(r.patientName) LIKE LOWER(CONCAT('%', :patientName, '%')))
            AND (:disease IS NULL OR LOWER(r.reportText) LIKE LOWER(CONCAT('%', :disease, '%'))
                 OR (r.summary IS NOT NULL AND LOWER(r.summary.medicalConditions) LIKE LOWER(CONCAT('%', :disease, '%'))))
            AND (:reportDate IS NULL OR r.reportDate = :reportDate)
            ORDER BY r.createdAt DESC
            """)
    Page<MedicalReport> searchReports(
            @Param("user") User user,
            @Param("patientName") String patientName,
            @Param("disease") String disease,
            @Param("reportDate") LocalDate reportDate,
            Pageable pageable
    );
}
