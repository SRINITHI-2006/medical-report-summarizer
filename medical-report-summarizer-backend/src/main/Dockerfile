# Use official Java 17 image (important: match your project)
FROM eclipse-temurin:17-jdk

# Set working directory inside container
WORKDIR /app

# Copy Maven build files
COPY pom.xml .
COPY src ./src

# Install Maven inside container and build the project
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

# Run the jar file
COPY target/*.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
