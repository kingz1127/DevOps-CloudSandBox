package com.cloudsandbox.auth.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
@Slf4j
public class MailConfig {

    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    public JavaMailSender javaMailSender() {
        log.info("📧 Initializing Mail Sender...");

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        // Use environment variables or defaults
        String host = System.getenv("MAIL_HOST") != null ?
                System.getenv("MAIL_HOST") : "smtp-relay.brevo.com";
        String port = System.getenv("MAIL_PORT") != null ?
                System.getenv("MAIL_PORT") : "2525";
        String username = System.getenv("BREVO_USER") != null ?
                System.getenv("BREVO_USER") : "";
        String password = System.getenv("BREVO_PASSWORD") != null ?
                System.getenv("BREVO_PASSWORD") : "";

        mailSender.setHost(host);
        mailSender.setPort(Integer.parseInt(port));
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");

        log.info("📧 Mail Sender configured with host: {}, port: {}", host, port);

        return mailSender;
    }
}