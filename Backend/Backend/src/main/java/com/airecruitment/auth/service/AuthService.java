package com.airecruitment.auth.service;

import com.airecruitment.auth.dto.AuthResponse;
import com.airecruitment.auth.dto.LoginRequest;
import com.airecruitment.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}