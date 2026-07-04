package com.medical.service;

import com.medical.dto.request.ReportUploadRequest;
import com.medical.dto.response.DashboardResponse;
import com.medical.dto.response.PageResponse;
import com.medical.dto.response.ReportResponse;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public interface ReportService {

    ReportResponse uploadReport(String email, ReportUploadRequest request, MultipartFile file);

    PageResponse<ReportResponse> getAllReports(String email, int page, int size,
                                                String patientName, String disease, LocalDate reportDate);

    ReportResponse getReportById(String email, Long id);

    DashboardResponse getDashboard(String email);

    void deleteReport(String email, Long id);
}
