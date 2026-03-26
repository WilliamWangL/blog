package com.techreview.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@TableName("comment")
public class Comment {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("article_id")
    private Long articleId;

    @TableField("parent_id")
    private Long parentId;

    @TableField("user_id")
    private Long userId;

    private String content;

    @TableField("author_name")
    private String authorName;

    @TableField("author_email")
    private String authorEmail;

    @TableField("like_count")
    private Integer likeCount;

    @TableField("status")
    private Integer status;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    @TableField("deleted")
    private Integer deleted;

    public static final Integer STATUS_PENDING = 0;
    public static final Integer STATUS_APPROVED = 1;
    public static final Integer STATUS_REJECTED = 2;
}