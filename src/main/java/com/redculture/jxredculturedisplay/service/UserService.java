package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.User;
import com.redculture.jxredculturedisplay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 服务层：用户管理业务实现。
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * 用户注册
     */
    public User register(User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("用户名已存在！");
        }
        return userRepository.save(user);
    }

    /**
     * 用户登录
     */
    public String login(User user) {
        User found = userRepository.findByUsername(user.getUsername());
        if (found != null && found.getPassword().equals(user.getPassword())) {
            return "登录成功";
        }
        return "用户名或密码错误";
    }
}