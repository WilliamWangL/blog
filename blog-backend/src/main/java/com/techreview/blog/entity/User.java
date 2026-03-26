package com.techreview.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_user")
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;

    private String password;

    private String email;

    private String nickname;

    private String avatar;

    private String bio;

    @TableField("role")
    private String role;

    @TableField("status")
    private Integer status;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    @TableField("deleted")
    private Integer deleted;

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_EDITOR = "EDITOR";
    public static final String ROLE_USER = "USER";

    public static final Integer STATUS_ACTIVE = 1;
    public static final Integer STATUS_INACTIVE = 0;
}