package com.medical.controller;

import com.medical.dto.request.ReportUploadRequest;
import com.medical.dto.response.ApiResponse;
import com.medical.dto.response.DashboardResponse;
import com.medical.dto.response.PageResponse;
import com.medical.dto.response.ReportResponse;
import com.medical.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ReportResponse>> uploadReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("data") @Valid ReportUploadRequest request,
            @RequestPart("file") MultipartFile file) {
        ReportResponse response = reportService.uploadReport(userDetails.getUsername(), request, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Report uploaded successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ReportResponse>>> getAllReports(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String patientName,
            @RequestParam(required = false) String disease,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        PageResponse<ReportResponse> reports = reportService.getAllReports(
                userDetails.getUsername(), page, size, patientName, disease, date);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        DashboardResponse dashboard = reportService.getDashboard(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportResponse>> getReportById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        ReportResponse report = reportService.getReportById(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        reportService.deleteReport(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Report deleted successfully", null));
    }
}
