package com.techreview.blog.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.techreview.blog.entity.Article;

import java.util.List;

public interface ArticleService extends IService<Article> {

    Page<Article> listArticles(Integer page, Integer size, Long categoryId);

    List<Article> getFeaturedArticles(Integer limit);

    Article getArticleBySlug(String slug);

    Page<Article> searchArticles(String keyword, Integer page, Integer size);
}