package com.techreview.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@TableName("tag")
public class Tag {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String slug;

    @TableField("usage_count")
    private Integer usageCount;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableLogic
    @TableField("deleted")
    private Integer deleted;
}