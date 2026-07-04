package com.medical.service.impl;

import com.medical.dto.response.PageResponse;
import com.medical.dto.response.SummaryResponse;
import com.medical.entity.MedicalReport;
import com.medical.entity.MedicalSummary;
import com.medical.entity.User;
import com.medical.exception.BadRequestException;
import com.medical.exception.ResourceNotFoundException;
import com.medical.gemini.GeminiService;
import com.medical.gemini.GeminiSummaryResult;
import com.medical.mapper.EntityMapper;
import com.medical.repository.MedicalReportRepository;
import com.medical.repository.MedicalSummaryRepository;
import com.medical.security.CustomUserDetailsService;
import com.medical.service.SummaryService;
import com.medical.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SummaryServiceImpl implements SummaryService {

    private final MedicalSummaryRepository summaryRepository;
    private final MedicalReportRepository reportRepository;
    private final CustomUserDetailsService userDetailsService;
    private final GeminiService geminiService;
    private final PdfExportService pdfExportService;
    private final EntityMapper entityMapper;
    private final JsonUtil jsonUtil;

    @Override
    @Transactional
    public SummaryResponse generateSummary(String email, Long reportId) {
        User user = userDetailsService.getCurrentUser(email);
        MedicalReport report = reportRepository.findByIdAndUser(reportId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        summaryRepository.findByReportId(reportId).ifPresent(existing -> {
            throw new BadRequestException("Summary already exists for this report. Delete it first to regenerate.");
        });

        GeminiSummaryResult result = geminiService.generateSummary(report.getReportText());

        MedicalSummary summary = MedicalSummary.builder()
                .report(report)
                .summary(result.getSummary())
                .medicalConditions(jsonUtil.toJson(result.getMedicalConditions()))
                .medications(jsonUtil.toJson(result.getMedications()))
                .labResults(jsonUtil.toJson(result.getLabResults()))
                .doctorRecommendations(result.getDoctorRecommendations())
                .riskFactors(jsonUtil.toJson(result.getRiskFactors()))
                .followUp(result.getFollowUp())
                .importantNotes(jsonUtil.toJson(result.getImportantNotes()))
                .build();

        summary = summaryRepository.save(summary);
        report.setSummary(summary);
        return entityMapper.toSummaryResponse(summary);
    }

    @Override
    @Transactional(readOnly = true)
    public SummaryResponse getSummaryById(String email, Long id) {
        User user = userDetailsService.getCurrentUser(email);
        MedicalSummary summary = summaryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Summary not found with id: " + id));
        return entityMapper.toSummaryResponse(summary);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<SummaryResponse> getAllSummaries(String email, int page, int size) {
        User user = userDetailsService.getCurrentUser(email);
        Pageable pageable = PageRequest.of(page, size);
        Page<MedicalSummary> summaries = summaryRepository.findByUser(user, pageable);

        List<SummaryResponse> content = summaries.getContent().stream()
                .map(entityMapper::toSummaryResponse)
                .collect(Collectors.toList());

        return PageResponse.<SummaryResponse>builder()
                .content(content)
                .page(summaries.getNumber())
                .size(summaries.getSize())
                .totalElements(summaries.getTotalElements())
                .totalPages(summaries.getTotalPages())
                .last(summaries.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadSummaryPdf(String email, Long id) {
        SummaryResponse summary = getSummaryById(email, id);
        return pdfExportService.generateSummaryPdf(summary);
    }

    @Override
    @Transactional
    public void deleteSummary(String email, Long id) {
        User user = userDetailsService.getCurrentUser(email);
        MedicalSummary summary = summaryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Summary not found with id: " + id));
        summaryRepository.delete(summary);
    }
}
