package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * 【模块】用户 Repository（C）
 * 【职责】注册/登录必须能按username查用户
 *
 * 【必须实现的方法签名（Spring Data JPA自动实现）】
 * - User findByUsername(String username);

public interface UserRepository extends JpaRepository<User, Integer> {
    // TODO: User findByUsername(String username);
}
 */

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 通过用户名查找用户
    Optional<User> findByUsername(String username);

    // 通过手机号查找用户
    Optional<User> findByPhone(String phone);

    // 通过用户名或手机号查找用户
    @Query("SELECT u FROM User u WHERE u.username = :identifier OR u.phone = :identifier")
    Optional<User> findByUsernameOrPhone(@Param("identifier") String identifier);

    // 检查用户名是否存在
    boolean existsByUsername(String username);

    // 检查手机号是否存在
    boolean existsByPhone(String phone);
}