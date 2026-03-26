package com.techreview.blog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.techreview.blog.dto.Result;
import com.techreview.blog.entity.User;
import com.techreview.blog.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public Result<Page<User>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<User> result = userService.page(new Page<>(page, size));
        // Clear passwords
        result.getRecords().forEach(user -> user.setPassword(null));
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<User> getById(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user != null) {
            user.setPassword(null);
        }
        return Result.success(user);
    }

    @PostMapping
    public Result<User> create(@RequestBody User user) {
        // Encode password
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        boolean saved = userService.save(user);
        if (saved) {
            user.setPassword(null);
        }
        return saved ? Result.success(user) : Result.error("Failed to create user");
    }

    @PutMapping("/{id}")
    public Result<User> update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        // Don't update password through this endpoint
        user.setPassword(null);
        boolean updated = userService.updateById(user);
        return updated ? Result.success(user) : Result.error("Failed to update user");
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        boolean deleted = userService.removeById(id);
        return deleted ? Result.success() : Result.error("Failed to delete user");
    }
}