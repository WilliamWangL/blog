package com.techreview.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@TableName("product")
public class Product {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String brand;

    private String model;

    private String description;

    private String image;

    @TableField("category_id")
    private Long categoryId;

    @TableField("price")
    private BigDecimal price;

    @TableField("rating")
    private Double rating;

    @TableField("review_count")
    private Integer reviewCount;

    @TableField("purchase_link")
    private String purchaseLink;

    @TableField("status")
    private Integer status;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    @TableField("deleted")
    private Integer deleted;

    public static final Integer STATUS_ACTIVE = 1;
    public static final Integer STATUS_INACTIVE = 0;
}