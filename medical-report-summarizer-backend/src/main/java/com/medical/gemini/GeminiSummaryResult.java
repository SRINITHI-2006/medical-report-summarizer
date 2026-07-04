package com.medical.gemini;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GeminiSummaryResult {

    private String summary;
    private List<String> medicalConditions;
    private List<String> medications;
    private List<String> labResults;
    private String doctorRecommendations;
    private List<String> riskFactors;
    private String followUp;
    private List<String> importantNotes;
}
