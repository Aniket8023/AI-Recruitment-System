package com.airecruitment.auth.serviceimpl;

import com.airecruitment.auth.dto.AuthResponse;
import com.airecruitment.auth.dto.LoginRequest;
import com.airecruitment.auth.dto.RegisterRequest;
import com.airecruitment.auth.service.AuthService;
import com.airecruitment.common.enums.AccountStatus;
import com.airecruitment.common.enums.UserRole;
import com.airecruitment.exception.custom.AccountNotActiveException;
import com.airecruitment.exception.custom.EmailAlreadyExistsException;
import com.airecruitment.exception.custom.InvalidCredentialsException;
import com.airecruitment.exception.custom.InvalidRoleException;
import com.airecruitment.security.jwt.JwtService;
import com.airecruitment.user.entity.User;
import com.airecruitment.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.airecruitment.security.jwt.JwtService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email already registered."
            );
        }

        if (request.getRole() == UserRole.ADMIN) {
            throw new InvalidRoleException(
                    "Admin registration is not allowed."
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .emailVerified(false)
                .build();

        if (request.getRole() == UserRole.RECRUITER) {

            user.setStatus(AccountStatus.PENDING_VERIFICATION);

        } else {

            user.setStatus(AccountStatus.ACTIVE);
        }

        User savedUser = userRepository.save(user);


        return AuthResponse.builder()
                .userId(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .token(null)
                .message("Registration Successful")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        // 1. Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password."
                        )
                );

        // 2. Verify password
        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new InvalidCredentialsException(
                    "Invalid email or password."
            );
        }

        // 3. Check account status
        if (user.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountNotActiveException(
                    "Your account is not active. Please contact the administrator."
            );
        }

        // 4. Update last login
        user.setLastLogin(LocalDateTime.now());

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        // 5. Return response
        return AuthResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .message("Login Successful")
                .build();
    }
}