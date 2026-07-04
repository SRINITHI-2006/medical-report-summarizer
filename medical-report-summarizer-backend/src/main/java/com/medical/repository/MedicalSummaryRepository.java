package com.medical.repository;

import com.medical.entity.MedicalSummary;
import com.medical.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicalSummaryRepository extends JpaRepository<MedicalSummary, Long> {

    Optional<MedicalSummary> findByReportId(Long reportId);

    @Query("""
            SELECT s FROM MedicalSummary s
            JOIN s.report r
            WHERE r.user = :user
            ORDER BY s.createdAt DESC
            """)
    Page<MedicalSummary> findByUser(@Param("user") User user, Pageable pageable);

    @Query("""
            SELECT COUNT(s) FROM MedicalSummary s
            JOIN s.report r
            WHERE r.user = :user
            """)
    long countByUser(@Param("user") User user);

    @Query("""
            SELECT s FROM MedicalSummary s
            JOIN FETCH s.report r
            WHERE s.id = :id AND r.user = :user
            """)
    Optional<MedicalSummary> findByIdAndUser(@Param("id") Long id, @Param("user") User user);
}
