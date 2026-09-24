package com.airecruitment.security;

import com.airecruitment.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // =============================================
                // CSRF
                // =============================================

                .csrf(AbstractHttpConfigurer::disable)


                // =============================================
                // CORS
                // =============================================

                .cors(cors -> {})


                // =============================================
                // SESSION
                // =============================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =============================================
                // AUTHORIZATION
                // =============================================

                .authorizeHttpRequests(auth -> auth

                        // Authentication APIs
                        .requestMatchers(
                                "/api/v1/auth/**"
                        ).permitAll()

                        .requestMatchers("/api/v1/companies/**")
                        .hasAnyRole("RECRUITER", "COMPANY_ADMIN")

                        // CORS preflight
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // All remaining APIs
                        .anyRequest().authenticated()
                )


                // =============================================
                // JWT FILTER
                // =============================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}