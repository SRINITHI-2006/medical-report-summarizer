package com.medical.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportUploadRequest {

    @NotBlank(message = "Patient name is required")
    private String patientName;

    private String doctorName;

    private String hospitalName;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate reportDate;
}
