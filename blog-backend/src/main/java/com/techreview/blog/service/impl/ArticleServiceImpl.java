package com.techreview.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.techreview.blog.entity.Article;
import com.techreview.blog.mapper.ArticleMapper;
import com.techreview.blog.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements ArticleService {

    private final ArticleMapper articleMapper;

    @Override
    public Page<Article> listArticles(Integer page, Integer size, Long categoryId) {
        Page<Article> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getStatus, Article.STATUS_PUBLISHED);
        wrapper.eq(Article::getDeleted, 0);
        
        if (categoryId != null) {
            wrapper.eq(Article::getCategoryId, categoryId);
        }
        
        wrapper.orderByDesc(Article::getPublishedAt);
        return this.page(pageParam, wrapper);
    }

    @Override
    public List<Article> getFeaturedArticles(Integer limit) {
        return articleMapper.selectFeaturedArticles(limit);
    }

    @Override
    public Article getArticleBySlug(String slug) {
        Article article = articleMapper.selectBySlug(slug);
        if (article != null) {
            articleMapper.incrementViewCount(article.getId());
        }
        return article;
    }

    @Override
    public Page<Article> searchArticles(String keyword, Integer page, Integer size) {
        Page<Article> pageParam = new Page<>(page, size);
        return articleMapper.searchByKeyword(pageParam, keyword);
    }
}