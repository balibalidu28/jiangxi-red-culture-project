package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 【实体】User（用户/管理员）
 * 【负责人】C
 *
 * 【对应表】users（注意：避免MySQL关键字user）
 * 【字段说明】
 * - id       主键
 * - username 用户名（唯一，必填）
 * - password 密码（课设可明文，需在README声明；可选BCrypt）
 * - role     角色（USER/ADMIN，后台鉴权用）

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 60)
    private String username;

    @Column(nullable = false, length = 120)
    private String password;

    @Column(nullable = false, length = 20)
    private String role;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
 */

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 用户ID，数据库自动生成

    @Column(nullable = false, unique = true, length = 50)
    private String username; // 用户名，唯一

    @Column(nullable = false, unique = true, length = 11)
    private String phone; // 手机号，唯一

    @Column(nullable = false)
    private String password; // 加密后的密码

    @Column(nullable = false, length = 20)
    private String role = "USER"; // 用户角色，默认为USER

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // 创建时间

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 更新时间

    @Column(name = "is_active")
    private Boolean isActive = true; // 是否激活

    // 自动设置创建时间和更新时间
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}