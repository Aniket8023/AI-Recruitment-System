package com.airecruitment.auth.serviceimpl;

import com.airecruitment.auth.dto.AuthResponse;
import com.airecruitment.auth.dto.LoginRequest;
import com.airecruitment.auth.dto.RegisterRequest;
import com.airecruitment.auth.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public AuthResponse register(RegisterRequest request) {
        return null;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        return null;
    }
}