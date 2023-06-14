#Start from here
FROM tomcat:8.5.85-jdk17-temurin-focal
RUN rm -rf /usr/local/tomcat/webapps/*
COPY ./ROOT.war /usr/local/tomcat/webapps/
#End