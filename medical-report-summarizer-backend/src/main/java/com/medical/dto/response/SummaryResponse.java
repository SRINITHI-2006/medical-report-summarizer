package com.medical.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SummaryResponse {

    private Long id;
    private Long reportId;
    private String patientName;
    private String summary;
    private List<String> medicalConditions;
    private List<String> medications;
    private List<String> labResults;
    private String doctorRecommendations;
    private List<String> riskFactors;
    private String followUp;
    private List<String> importantNotes;
    private LocalDateTime createdAt;
}
