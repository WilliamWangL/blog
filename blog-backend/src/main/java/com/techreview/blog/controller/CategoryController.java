package com.techreview.blog.controller;

import com.techreview.blog.dto.Result;
import com.techreview.blog.entity.Category;
import com.techreview.blog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public Result<List<Category>> list() {
        List<Category> categories = categoryService.listActiveCategories();
        return Result.success(categories);
    }

    @GetMapping("/{slug}")
    public Result<Category> detail(@PathVariable String slug) {
        Category category = categoryService.getCategoryBySlug(slug);
        return Result.success(category);
    }
}