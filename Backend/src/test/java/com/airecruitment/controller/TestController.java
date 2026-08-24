package com.airecruitment.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping("/protected")
    public String protectedEndpoint(Authentication authentication) {

        return "JWT Authentication Successful. Logged in as: "
                + authentication.getName();
    }
}