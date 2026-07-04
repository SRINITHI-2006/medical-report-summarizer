package com.medical.service;

import com.medical.dto.request.LoginRequest;
import com.medical.dto.request.RegisterRequest;
import com.medical.dto.response.AuthResponse;
import com.medical.dto.response.UserProfileResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserProfileResponse getProfile(String email);
}
