package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * 用户数据模型
 */
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;            // 用户ID

    private String username;    // 用户名
    private String password;    // 密码
    private String email;       // 邮箱

    // 必须提供getter和setter方法，否则外部无法访问

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {     // <<<< 解决报错的关键
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {     // 方便UserService调用
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() { return email; }

    public void setEmail(String email) {
        this.email = email;
    }
}