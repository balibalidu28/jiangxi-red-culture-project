package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    // TODO: 注入 UserRepository

    public User register(User user) {
        /*
         * 1) 校验 username/password 非空
         * 2) 查 repo.findByUsername(username) 是否已存在
         *    - 存在：抛异常（用户名重复）
         * 3) role 默认：为空则设为 "USER"
         * 4) user.id=null
         * 5) repo.save(user)
         * 6) 返回用户（建议返回前 password 置空）
         */
        throw new UnsupportedOperationException("TODO");
    }

    public User login(String username, String password) {
        /*
         * 1) 校验 username/password 非空
         * 2) db=repo.findByUsername(username)
         *    - 不存在：抛异常（用户不存在）
         * 3) 校验密码一致
         *    - 不一致：抛异常（密码错误）
         * 4) 返回db（建议 password 置空）
         * 5) 可选：写入session用于后台鉴权
         */
        throw new UnsupportedOperationException("TODO");
    }

    public User getOrThrow(Integer id) {
        /* 1) repo.findById 2) 不存在抛异常 */
        throw new UnsupportedOperationException("TODO");
    }
}