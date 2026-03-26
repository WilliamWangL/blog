package com.techreview.blog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.techreview.blog.dto.Result;
import com.techreview.blog.entity.Article;
import com.techreview.blog.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/articles")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
public class AdminArticleController {

    private final ArticleService articleService;

    @GetMapping
    public Result<Page<Article>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<Article> result = articleService.page(new Page<>(page, size));
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Article> getById(@PathVariable Long id) {
        Article article = articleService.getById(id);
        return Result.success(article);
    }

    @PostMapping
    public Result<Article> create(@RequestBody Article article) {
        boolean saved = articleService.save(article);
        return saved ? Result.success(article) : Result.error("Failed to create article");
    }

    @PutMapping("/{id}")
    public Result<Article> update(@PathVariable Long id, @RequestBody Article article) {
        article.setId(id);
        boolean updated = articleService.updateById(article);
        return updated ? Result.success(article) : Result.error("Failed to update article");
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        boolean deleted = articleService.removeById(id);
        return deleted ? Result.success() : Result.error("Failed to delete article");
    }
}