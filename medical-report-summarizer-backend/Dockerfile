# ==========================================
# Server
# ==========================================

server.port=${PORT:8080}
spring.application.name=medical-report-summarizer

# ==========================================
# Database
# ==========================================

spring.datasource.url=${MYSQL_URL}
spring.datasource.username=${MYSQLUSER}
spring.datasource.password=${MYSQLPASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ==========================================
# JPA
# ==========================================

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

# ==========================================
# File Upload
# ==========================================

spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

app.upload.dir=${UPLOAD_DIR:uploads}

# ==========================================
# JWT
# ==========================================

app.jwt.secret=${JWT_SECRET:MedicalReportSummarizerSecretKeyForJWTTokenGenerationMustBeLongEnough2024}
app.jwt.expiration-ms=86400000

# ==========================================
# Gemini
# ==========================================

gemini.api.key=${GEMINI_API_KEY}
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent

# ==========================================
# CORS
# ==========================================

app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:5173}
