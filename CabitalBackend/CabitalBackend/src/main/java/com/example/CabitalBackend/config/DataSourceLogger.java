package com.example.CabitalBackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.util.logging.Logger;

@Configuration
public class DataSourceLogger {

    private static final Logger log = Logger.getLogger(DataSourceLogger.class.getName());

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String user;

    @PostConstruct
    public void logDataSource() {
        log.info("Using datasource url=" + url + " username=" + user);
    }
}


