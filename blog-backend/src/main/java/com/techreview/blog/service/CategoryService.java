package com.techreview.blog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.techreview.blog.entity.Category;

import java.util.List;

public interface CategoryService extends IService<Category> {

    List<Category> listActiveCategories();

    Category getCategoryBySlug(String slug);
}