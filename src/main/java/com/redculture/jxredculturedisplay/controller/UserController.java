package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.User;
import com.redculture.jxredculturedisplay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 控制层：用户模块相关API请求。
 */
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 用户注册接口
     */
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    /**
     * 用户登录接口
     */
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userService.login(user);
    }
}