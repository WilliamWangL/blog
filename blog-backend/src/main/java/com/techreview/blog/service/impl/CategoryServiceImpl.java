package com.techreview.blog.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.techreview.blog.entity.Category;
import com.techreview.blog.mapper.CategoryMapper;
import com.techreview.blog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    private final CategoryMapper categoryMapper;

    @Override
    public List<Category> listActiveCategories() {
        return categoryMapper.selectActiveCategories();
    }

    @Override
    public Category getCategoryBySlug(String slug) {
        return categoryMapper.selectBySlug(slug);
    }
}