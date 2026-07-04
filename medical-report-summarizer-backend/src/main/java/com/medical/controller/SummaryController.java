package com.medical.controller;

import com.medical.dto.response.ApiResponse;
import com.medical.dto.response.PageResponse;
import com.medical.dto.response.SummaryResponse;
import com.medical.service.SummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summaries")
@RequiredArgsConstructor
public class SummaryController {

    private final SummaryService summaryService;

    @PostMapping("/generate/{reportId}")
    public ResponseEntity<ApiResponse<SummaryResponse>> generateSummary(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long reportId) {
        SummaryResponse summary = summaryService.generateSummary(userDetails.getUsername(), reportId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Summary generated successfully", summary));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SummaryResponse>> getSummaryById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        SummaryResponse summary = summaryService.getSummaryById(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<SummaryResponse>>> getAllSummaries(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<SummaryResponse> summaries = summaryService.getAllSummaries(
                userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success(summaries));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadSummaryPdf(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        byte[] pdf = summaryService.downloadSummaryPdf(userDetails.getUsername(), id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "medical-summary-" + id + ".pdf");
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSummary(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        summaryService.deleteSummary(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Summary deleted successfully", null));
    }
}
