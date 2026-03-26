package com.techreview.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@TableName("article")
public class Article {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String slug;

    private String summary;

    private String content;

    private String coverImage;

    @TableField("category_id")
    private Long categoryId;

    @TableField("author_id")
    private Long authorId;

    @TableField("view_count")
    private Integer viewCount;

    @TableField("like_count")
    private Integer likeCount;

    @TableField("comment_count")
    private Integer commentCount;

    @TableField("rating")
    private Double rating;

    @TableField("status")
    private Integer status;

    @TableField("is_featured")
    private Boolean isFeatured;

    @TableField("published_at")
    private LocalDateTime publishedAt;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    @TableField("deleted")
    private Integer deleted;

    public static final Integer STATUS_DRAFT = 0;
    public static final Integer STATUS_PUBLISHED = 1;
    public static final Integer STATUS_ARCHIVED = 2;
}