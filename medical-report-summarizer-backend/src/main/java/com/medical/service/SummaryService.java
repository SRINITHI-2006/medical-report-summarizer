package com.medical.service;

import com.medical.dto.response.PageResponse;
import com.medical.dto.response.SummaryResponse;

public interface SummaryService {

    SummaryResponse generateSummary(String email, Long reportId);

    SummaryResponse getSummaryById(String email, Long id);

    PageResponse<SummaryResponse> getAllSummaries(String email, int page, int size);

    byte[] downloadSummaryPdf(String email, Long id);

    void deleteSummary(String email, Long id);
}
