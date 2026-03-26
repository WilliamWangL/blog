package com.techreview.blog.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.techreview.blog.entity.User;
import com.techreview.blog.mapper.UserMapper;
import com.techreview.blog.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
}