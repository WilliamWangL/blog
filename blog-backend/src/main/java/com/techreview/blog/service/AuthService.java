package com.techreview.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.techreview.blog.dto.LoginRequest;
import com.techreview.blog.dto.LoginResponse;
import com.techreview.blog.entity.User;
import com.techreview.blog.mapper.UserMapper;
import com.techreview.blog.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );
            
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUsername, request.getUsername())
                   .eq(User::getDeleted, 0);
            
            User user = userMapper.selectOne(wrapper);
            
            if (user == null) {
                throw new BadCredentialsException("User not found");
            }
            
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
            
            // Clear password before returning
            user.setPassword(null);
            
            return new LoginResponse(token, user);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }
}