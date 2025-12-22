package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.User;
import com.redculture.jxredculturedisplay.model.dto.LoginRequest;
import com.redculture.jxredculturedisplay.model.dto.RegisterRequest;
import com.redculture.jxredculturedisplay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * 用户注册
     * @param request 注册请求
     * @return 注册成功的用户
     * @throws IllegalArgumentException 如果验证失败
     */
    @Transactional
    public User register(RegisterRequest request) {
        // 1. 验证两次密码是否一致
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("两次输入的密码不一致");
        }

        // 2. 检查手机号是否已注册
        if (checkPhoneExists(request.getPhone())) {
            throw new IllegalArgumentException("该手机号已被注册");
        }

        // 3. 检查用户名是否已存在
        if (checkUsernameExists(request.getUsername())) {
            throw new IllegalArgumentException("该用户名已被使用");
        }

        // 4. 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // 密码加密
        user.setRole("USER"); // 设置为普通用户权限
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // 5. 保存到数据库
        return userRepository.save(user);
    }

    /**
     * 用户登录验证
     * @param request 登录请求
     * @return 验证成功的用户
     * @throws IllegalArgumentException 如果验证失败
     */
    public User login(LoginRequest request) {
        // 1. 通过用户名或手机号查找用户
        Optional<User> userOptional = userRepository.findByUsernameOrPhone(request.getUsername());

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("用户名或手机号不存在");
        }

        User user = userOptional.get();

        // 2. 检查用户是否被禁用
        if (!user.getIsActive()) {
            throw new IllegalArgumentException("该账号已被禁用，请联系管理员");
        }

        // 3. 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("密码错误");
        }

        // 4. 登录成功，更新最后登录时间
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return user;
    }

    /**
     * 检查用户名是否存在
     * @param username 用户名
     * @return 是否存在
     */
    public boolean checkUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * 检查手机号是否存在
     * @param phone 手机号
     * @return 是否存在
     */
    public boolean checkPhoneExists(String phone) {
        return userRepository.existsByPhone(phone);
    }

    /**
     * 根据用户ID查找用户
     * @param id 用户ID
     * @return 用户对象（Optional）
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * 生成JWT令牌（如果使用JWT认证）
     * 这里简化处理，实际项目应使用专业的JWT库
     */
    public String generateToken(User user) {
        // 这里可以集成JWT生成逻辑
        // 实际项目中建议使用Spring Security + JWT
        return "token_" + user.getId() + "_" + System.currentTimeMillis();
    }

    /**
     * 验证用户密码
     * @param rawPassword 原始密码
     * @param encodedPassword 加密后的密码
     * @return 是否匹配
     */
    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * 更新用户信息
     * @param user 用户对象
     * @return 更新后的用户
     */
    @Transactional
    public User updateUser(User user) {
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    /**
     * 更新用户密码
     * @param userId 用户ID
     * @param newPassword 新密码
     * @return 是否成功
     */
    @Transactional
    public boolean updatePassword(Long userId, String newPassword) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return true;
    }

    /**
     * 停用用户账户
     * @param userId 用户ID
     * @return 是否成功
     */
    @Transactional
    public boolean deactivateUser(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();
        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return true;
    }

    /**
     * 激活用户账户
     * @param userId 用户ID
     * @return 是否成功
     */
    @Transactional
    public boolean activateUser(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();
        user.setIsActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return true;
    }
}




/*
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

        throw new UnsupportedOperationException("TODO");
    }

    public User getOrThrow(Integer id) {
        /* 1) repo.findById 2) 不存在抛异常
        throw new UnsupportedOperationException("TODO");
    }
}
*/