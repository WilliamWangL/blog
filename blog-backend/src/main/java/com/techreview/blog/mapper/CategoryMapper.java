package com.techreview.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.techreview.blog.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {

    @Select("SELECT * FROM category WHERE slug = #{slug} AND status = 1 AND deleted = 0")
    Category selectBySlug(String slug);

    @Select("SELECT * FROM category WHERE status = 1 AND deleted = 0 ORDER BY sort_order ASC")
    List<Category> selectActiveCategories();

    @Select("SELECT * FROM category WHERE parent_id IS NULL AND status = 1 AND deleted = 0 ORDER BY sort_order ASC")
    List<Category> selectRootCategories();
}