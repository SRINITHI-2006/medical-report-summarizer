package com.medical.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponse {

    private Long id;
    private String patientName;
    private String doctorName;
    private String hospitalName;
    private LocalDate reportDate;
    private String fileName;
    private String reportText;
    private boolean hasSummary;
    private Long summaryId;
    private LocalDateTime createdAt;
}
