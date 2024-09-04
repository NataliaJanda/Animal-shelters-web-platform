#
#RUN apk update && \
#    apk add --no-cache openjdk17 && \
#    apk add --no-cache curl && \
#    rm -rf /var/cache/apk/*
#
#ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
#ENV PATH=$PATH:$JAVA_HOME/bin
#
#WORKDIR /app
#
## Copy the Gradle files and source code
#COPY . .
## Start the app
#CMD ./gradlew build && java -jar build/libs/server-1.0-SNAPSHOT.jar

############
FROM openjdk:17-jdk-slim

# Create and set the working directory
RUN mkdir /app
WORKDIR /app

# Copy the specific JAR file into the container
COPY build/libs/Sheltersapp-0.0.1-SNAPSHOT.jar /app/Sheltersapp-0.0.1-SNAPSHOT.jar

# Expose the port the application runs on
EXPOSE 8080

# Define the command to run the JAR file
CMD ["java", "-jar", "Sheltersapp-0.0.1-SNAPSHOT.jar"]
