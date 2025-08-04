# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

################################################################################

# Create a stage for resolving and downloading dependencies.
FROM gradle:8.7-jdk21

WORKDIR /build

COPY ./src src/
COPY build.gradle build.gradle

ENV GOOGLE_APPLICATION_CREDENTIALS /build/src/main/resources/application_default_credentials.json

EXPOSE 8080

ENTRYPOINT ["gradle","translation"]
