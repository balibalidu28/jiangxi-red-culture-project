package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 【模块】用户 Repository（C）
 * 【职责】注册/登录必须能按username查用户
 *
 * 【必须实现的方法签名（Spring Data JPA自动实现）】
 * - User findByUsername(String username);
 */
public interface UserRepository extends JpaRepository<User, Integer> {
    // TODO: User findByUsername(String username);
}