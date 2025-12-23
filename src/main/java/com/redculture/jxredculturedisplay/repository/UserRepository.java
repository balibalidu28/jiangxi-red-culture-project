package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 通过用户名查找用户
    Optional<User> findByUsername(String username);

    // 通过手机号查找用户
    Optional<User> findByPhone(String phone);

    // 通过用户名或手机号查找用户 - 修改方法名和参数
    @Query("SELECT u FROM User u WHERE u.username = :identifier OR u.phone = :identifier")
    Optional<User> findByUsernameOrPhone(@Param("identifier") String identifier);

    // 或者使用Spring Data JPA的命名约定：
    // Optional<User> findByUsernameOrPhone(String username, String phone);

    // 检查用户名是否存在
    boolean existsByUsername(String username);

    // 检查手机号是否存在
    boolean existsByPhone(String phone);
}