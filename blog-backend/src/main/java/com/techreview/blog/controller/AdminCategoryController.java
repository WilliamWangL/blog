package com.techreview.blog.controller;

import com.techreview.blog.dto.Result;
import com.techreview.blog.entity.Category;
import com.techreview.blog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public Result<List<Category>> list() {
        List<Category> categories = categoryService.list();
        return Result.success(categories);
    }

    @GetMapping("/{id}")
    public Result<Category> getById(@PathVariable Long id) {
        Category category = categoryService.getById(id);
        return Result.success(category);
    }

    @PostMapping
    public Result<Category> create(@RequestBody Category category) {
        boolean saved = categoryService.save(category);
        return saved ? Result.success(category) : Result.error("Failed to create category");
    }

    @PutMapping("/{id}")
    public Result<Category> update(@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        boolean updated = categoryService.updateById(category);
        return updated ? Result.success(category) : Result.error("Failed to update category");
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        boolean deleted = categoryService.removeById(id);
        return deleted ? Result.success() : Result.error("Failed to delete category");
    }
}