FROM maven:3.8.6-eclipse-temurin-17-alpine AS mvn
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-alpine
COPY --from=mvn target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]