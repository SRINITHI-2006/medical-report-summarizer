package com.medical.mapper;

import com.medical.dto.response.ReportResponse;
import com.medical.dto.response.SummaryResponse;
import com.medical.dto.response.UserProfileResponse;
import com.medical.entity.MedicalReport;
import com.medical.entity.MedicalSummary;
import com.medical.entity.User;
import com.medical.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EntityMapper {

    private final JsonUtil jsonUtil;

    public UserProfileResponse toUserProfile(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public ReportResponse toReportResponse(MedicalReport report) {
        boolean hasSummary = report.getSummary() != null;
        return ReportResponse.builder()
                .id(report.getId())
                .patientName(report.getPatientName())
                .doctorName(report.getDoctorName())
                .hospitalName(report.getHospitalName())
                .reportDate(report.getReportDate())
                .fileName(report.getFileName())
                .reportText(report.getReportText())
                .hasSummary(hasSummary)
                .summaryId(hasSummary ? report.getSummary().getId() : null)
                .createdAt(report.getCreatedAt())
                .build();
    }

    public ReportResponse toReportResponseWithoutText(MedicalReport report) {
        ReportResponse response = toReportResponse(report);
        response.setReportText(null);
        return response;
    }

    public SummaryResponse toSummaryResponse(MedicalSummary summary) {
        return SummaryResponse.builder()
                .id(summary.getId())
                .reportId(summary.getReport().getId())
                .patientName(summary.getReport().getPatientName())
                .summary(summary.getSummary())
                .medicalConditions(jsonUtil.fromJsonList(summary.getMedicalConditions()))
                .medications(jsonUtil.fromJsonList(summary.getMedications()))
                .labResults(jsonUtil.fromJsonList(summary.getLabResults()))
                .doctorRecommendations(summary.getDoctorRecommendations())
                .riskFactors(jsonUtil.fromJsonList(summary.getRiskFactors()))
                .followUp(summary.getFollowUp())
                .importantNotes(jsonUtil.fromJsonList(summary.getImportantNotes()))
                .createdAt(summary.getCreatedAt())
                .build();
    }
}
