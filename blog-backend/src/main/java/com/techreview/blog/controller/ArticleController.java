package com.techreview.blog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.techreview.blog.dto.Result;
import com.techreview.blog.entity.Article;
import com.techreview.blog.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public Result<Page<Article>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long categoryId) {
        Page<Article> result = articleService.listArticles(page, size, categoryId);
        return Result.success(result);
    }

    @GetMapping("/featured")
    public Result<List<Article>> featured(@RequestParam(defaultValue = "5") Integer limit) {
        List<Article> articles = articleService.getFeaturedArticles(limit);
        return Result.success(articles);
    }

    @GetMapping("/{slug}")
    public Result<Article> detail(@PathVariable String slug) {
        Article article = articleService.getArticleBySlug(slug);
        return Result.success(article);
    }

    @GetMapping("/search")
    public Result<Page<Article>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<Article> result = articleService.searchArticles(keyword, page, size);
        return Result.success(result);
    }
}