package com.techreview.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.techreview.blog.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {

    @Select("SELECT * FROM article WHERE slug = #{slug} AND status = 1 AND deleted = 0")
    Article selectBySlug(String slug);

    @Select("SELECT * FROM article WHERE status = 1 AND deleted = 0 ORDER BY published_at DESC")
    List<Article> selectPublishedArticles();

    @Select("SELECT * FROM article WHERE status = 1 AND deleted = 0 AND is_featured = 1 ORDER BY published_at DESC LIMIT #{limit}")
    List<Article> selectFeaturedArticles(@Param("limit") Integer limit);

    @Select("SELECT * FROM article WHERE status = 1 AND deleted = 0 AND category_id = #{categoryId} ORDER BY published_at DESC")
    Page<Article> selectByCategory(Page<Article> page, @Param("categoryId") Long categoryId);

    @Update("UPDATE article SET view_count = view_count + 1 WHERE id = #{id}")
    void incrementViewCount(@Param("id") Long id);

    @Select("SELECT * FROM article WHERE status = 1 AND deleted = 0 AND " +
            "(title LIKE CONCAT('%', #{keyword}, '%') OR summary LIKE CONCAT('%', #{keyword}, '%') OR content LIKE CONCAT('%', #{keyword}, '%')) " +
            "ORDER BY published_at DESC")
    Page<Article> searchByKeyword(Page<Article> page, @Param("keyword") String keyword);
}