package com.techreview.blog.controller;

import com.techreview.blog.dto.LoginRequest;
import com.techreview.blog.dto.LoginResponse;
import com.techreview.blog.dto.Result;
import com.techreview.blog.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return Result.success(response);
    }
}