package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 数据访问层：用户数据库操作。
 */
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}