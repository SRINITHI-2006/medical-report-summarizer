package com.medical.service.impl;

import com.medical.dto.request.ReportUploadRequest;
import com.medical.dto.response.DashboardResponse;
import com.medical.dto.response.PageResponse;
import com.medical.dto.response.ReportResponse;
import com.medical.entity.MedicalReport;
import com.medical.entity.User;
import com.medical.exception.BadRequestException;
import com.medical.exception.ResourceNotFoundException;
import com.medical.mapper.EntityMapper;
import com.medical.repository.MedicalReportRepository;
import com.medical.repository.MedicalSummaryRepository;
import com.medical.security.CustomUserDetailsService;
import com.medical.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final MedicalReportRepository reportRepository;
    private final MedicalSummaryRepository summaryRepository;
    private final CustomUserDetailsService userDetailsService;
    private final FileExtractionService fileExtractionService;
    private final EntityMapper entityMapper;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    @Transactional
    public ReportResponse uploadReport(String email, ReportUploadRequest request, MultipartFile file) {
        User user = userDetailsService.getCurrentUser(email);
        fileExtractionService.validateFile(file);
        String reportText = fileExtractionService.extractText(file);

        if (reportText == null || reportText.isBlank()) {
            throw new BadRequestException("Could not extract text from the uploaded file");
        }

        String storedFileName = storeFile(file);

        MedicalReport report = MedicalReport.builder()
                .user(user)
                .patientName(request.getPatientName())
                .doctorName(request.getDoctorName())
                .hospitalName(request.getHospitalName())
                .reportDate(request.getReportDate())
                .fileName(file.getOriginalFilename())
                .filePath(storedFileName)
                .reportText(reportText)
                .build();

        report = reportRepository.save(report);
        return entityMapper.toReportResponse(report);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReportResponse> getAllReports(String email, int page, int size,
                                                       String patientName, String disease, LocalDate reportDate) {
        User user = userDetailsService.getCurrentUser(email);
        Pageable pageable = PageRequest.of(page, size);

        Page<MedicalReport> reports;
        if (hasSearchFilters(patientName, disease, reportDate)) {
            reports = reportRepository.searchReports(
                    user,
                    emptyToNull(patientName),
                    emptyToNull(disease),
                    reportDate,
                    pageable
            );
        } else {
            reports = reportRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        }

        return toPageResponse(reports);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportResponse getReportById(String email, Long id) {
        User user = userDetailsService.getCurrentUser(email);
        MedicalReport report = reportRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
        return entityMapper.toReportResponse(report);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(String email) {
        User user = userDetailsService.getCurrentUser(email);
        Pageable pageable = PageRequest.of(0, 5);

        List<ReportResponse> recentReports = reportRepository
                .findByUserOrderByCreatedAtDesc(user, pageable)
                .getContent()
                .stream()
                .map(entityMapper::toReportResponseWithoutText)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalReports(reportRepository.countByUser(user))
                .totalSummaries(summaryRepository.countByUser(user))
                .recentReports(recentReports)
                .build();
    }

    @Override
    @Transactional
    public void deleteReport(String email, Long id) {
        User user = userDetailsService.getCurrentUser(email);
        MedicalReport report = reportRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));

        deleteStoredFile(report.getFilePath());
        reportRepository.delete(report);
    }

    private String storeFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String extension = file.getOriginalFilename()
                    .substring(file.getOriginalFilename().lastIndexOf('.'));
            String fileName = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            return fileName;
        } catch (IOException e) {
            throw new BadRequestException("Failed to store file: " + e.getMessage());
        }
    }

    private void deleteStoredFile(String filePath) {
        try {
            Path path = Paths.get(uploadDir, filePath);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            // Log but don't fail deletion
        }
    }

    private boolean hasSearchFilters(String patientName, String disease, LocalDate reportDate) {
        return (patientName != null && !patientName.isBlank())
                || (disease != null && !disease.isBlank())
                || reportDate != null;
    }

    private String emptyToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    private PageResponse<ReportResponse> toPageResponse(Page<MedicalReport> page) {
        List<ReportResponse> content = page.getContent().stream()
                .map(entityMapper::toReportResponseWithoutText)
                .collect(Collectors.toList());

        return PageResponse.<ReportResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
