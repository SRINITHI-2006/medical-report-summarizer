package com.medical.service.impl;

import com.medical.dto.response.SummaryResponse;
import com.medical.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PdfExportService {

    private static final float MARGIN = 50;
    private static final float FONT_SIZE = 11;
    private static final float LEADING = 14;
    private static final float TITLE_SIZE = 14;

    public byte[] generateSummaryPdf(SummaryResponse summary) {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font boldFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            PdfWriter writer = new PdfWriter(document, font, boldFont);
            writer.writeTitle("Medical Report Summary");
            writer.writeLine("Patient: " + nullSafe(summary.getPatientName()));
            writer.writeSection("Overall Summary", nullSafe(summary.getSummary()));
            writer.writeSection("Medical Conditions", formatList(summary.getMedicalConditions()));
            writer.writeSection("Medications", formatList(summary.getMedications()));
            writer.writeSection("Laboratory Results", formatList(summary.getLabResults()));
            writer.writeSection("Doctor Recommendations", nullSafe(summary.getDoctorRecommendations()));
            writer.writeSection("Risk Factors", formatList(summary.getRiskFactors()));
            writer.writeSection("Follow-up Advice", nullSafe(summary.getFollowUp()));
            writer.writeSection("Important Notes", formatList(summary.getImportantNotes()));
            writer.close();

            document.save(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            log.error("PDF generation failed: {}", e.getMessage(), e);
            throw new BadRequestException("Failed to generate PDF: " + e.getMessage());
        }
    }

    private String nullSafe(String value) {
        return (value == null || value.isBlank()) ? "Not Mentioned" : value;
    }

    private String formatList(List<String> items) {
        if (items == null || items.isEmpty()) {
            return "Not Mentioned";
        }
        return String.join("\n", items.stream().map(i -> "• " + i).toList());
    }

    private static class PdfWriter {
        private final PDDocument document;
        private final PDType1Font font;
        private final PDType1Font boldFont;
        private PDPage page;
        private PDPageContentStream stream;
        private float y;

        PdfWriter(PDDocument document, PDType1Font font, PDType1Font boldFont) throws IOException {
            this.document = document;
            this.font = font;
            this.boldFont = boldFont;
            newPage();
        }

        void writeTitle(String title) throws IOException {
            writeWrapped(boldFont, 18, title);
            y -= 10;
        }

        void writeLine(String text) throws IOException {
            writeWrapped(font, FONT_SIZE, text);
        }

        void writeSection(String title, String content) throws IOException {
            y -= 8;
            writeWrapped(boldFont, TITLE_SIZE, title);
            y -= 4;
            writeWrapped(font, FONT_SIZE, content);
        }

        private void newPage() throws IOException {
            if (stream != null) {
                stream.close();
            }
            page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            stream = new PDPageContentStream(document, page);
            y = page.getMediaBox().getHeight() - MARGIN;
        }

        private void writeWrapped(PDType1Font f, float size, String text) throws IOException {
            float maxWidth = page.getMediaBox().getWidth() - 2 * MARGIN;
            List<String> lines = wrapText(text, f, size, maxWidth);

            for (String line : lines) {
                if (y < MARGIN + LEADING) {
                    newPage();
                }
                stream.beginText();
                stream.setFont(f, size);
                stream.newLineAtOffset(MARGIN, y);
                stream.showText(line);
                stream.endText();
                y -= LEADING;
            }
        }

        void close() throws IOException {
            if (stream != null) {
                stream.close();
            }
        }

        private List<String> wrapText(String text, PDType1Font f, float size, float maxWidth) throws IOException {
            List<String> lines = new ArrayList<>();
            for (String paragraph : text.split("\n")) {
                String[] words = paragraph.split("\\s+");
                StringBuilder line = new StringBuilder();
                for (String word : words) {
                    if (word.isEmpty()) continue;
                    String test = line.isEmpty() ? word : line + " " + word;
                    float width = f.getStringWidth(test) / 1000 * size;
                    if (width > maxWidth && !line.isEmpty()) {
                        lines.add(line.toString());
                        line = new StringBuilder(word);
                    } else {
                        line = new StringBuilder(test);
                    }
                }
                if (!line.isEmpty()) {
                    lines.add(line.toString());
                }
            }
            return lines;
        }
    }
}
