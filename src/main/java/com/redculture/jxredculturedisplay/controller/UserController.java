package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.User;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    // TODO: 注入 UserService

    @PostMapping("/api/users/register")
    public User register(@RequestBody User user) {
        /*
         * 1) 校验username/password
         * 2) return service.register(user)
         * 3) 建议返回前 password 置空
         */
        return null;
    }

    @PostMapping("/api/users/login")
    public User login(@RequestBody User user) {
        /*
         * 1) 校验username/password
         * 2) return service.login(user.getUsername(), user.getPassword())
         * 3) 可选：写session用于后台鉴权
         */
        return null;
    }
}