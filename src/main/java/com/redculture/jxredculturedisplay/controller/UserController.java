package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.User;
import com.redculture.jxredculturedisplay.model.dto.ApiResponse;
import com.redculture.jxredculturedisplay.model.dto.LoginRequest;
import com.redculture.jxredculturedisplay.model.dto.RegisterRequest;
import com.redculture.jxredculturedisplay.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins:*}", maxAge = 3600)
public class UserController {

    private final UserService userService;

    /**
     * 用户注册接口
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(
            @Valid @RequestBody RegisterRequest request,
            BindingResult bindingResult) {

        // 1. 验证请求参数
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessage = new StringBuilder();
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessage.append(error.getDefaultMessage()).append("; ");
            }
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(errorMessage.toString()));
        }

        try {
            // 2. 调用服务层进行注册
            User user = userService.register(request);

            // 3. 构造响应数据
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("userId", user.getId());
            responseData.put("username", user.getUsername());
            responseData.put("phone", user.getPhone());
            responseData.put("role", user.getRole());

            // 4. 返回成功响应
            return ResponseEntity.ok(ApiResponse.success(
                    "注册成功！欢迎加入江西红色文化信息网",
                    responseData
            ));

        } catch (IllegalArgumentException e) {
            // 5. 处理业务逻辑异常
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            // 6. 处理系统异常
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("注册失败，请稍后重试"));
        }
    }

    /**
     * 用户登录接口
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
            @Valid @RequestBody LoginRequest request,
            BindingResult bindingResult) {

        // 1. 验证请求参数
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getAllErrors()
                    .stream()
                    .findFirst()
                    .map(ObjectError::getDefaultMessage)
                    .orElse("请求参数错误");
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(errorMessage));
        }

        try {
            // 2. 调用服务层进行登录验证
            User user = userService.login(request);

            // 3. 生成令牌（这里简化处理，实际项目用JWT）
            String token = userService.generateToken(user);

            // 4. 构造响应数据
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "phone", user.getPhone(),
                    "role", user.getRole()
            ));

            // 5. 返回成功响应
            return ResponseEntity.ok(ApiResponse.success(
                    "登录成功！欢迎访问江西红色文化信息网",
                    responseData
            ));

        } catch (IllegalArgumentException e) {
            // 6. 处理登录失败
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            // 7. 处理系统异常
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("登录失败，请稍后重试"));
        }
    }

    /**
     * 检查用户名是否可用
     * GET /api/auth/check-username?username=xxx
     */
    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Boolean>> checkUsername(@RequestParam String username) {
        boolean exists = userService.checkUsernameExists(username);
        String message = exists ? "用户名已被使用" : "用户名可用";
        return ResponseEntity.ok(ApiResponse.success(message, !exists));
    }

    /**
     * 检查手机号是否可用
     * GET /api/auth/check-phone?phone=xxx
     */
    @GetMapping("/check-phone")
    public ResponseEntity<ApiResponse<Boolean>> checkPhone(@RequestParam String phone) {
        boolean exists = userService.checkPhoneExists(phone);
        String message = exists ? "手机号已被注册" : "手机号可用";
        return ResponseEntity.ok(ApiResponse.success(message, !exists));
    }
}



/*
@RestController
public class UserController {
    // TODO: 注入 UserService

    @PostMapping("/api/users/register")
    public User register(@RequestBody User user) {
        /*
         * 1) 校验username/password
         * 2) return service.register(user)
         * 3) 建议返回前 password 置空

        return null;
    }

    @PostMapping("/api/users/login")
    public User login(@RequestBody User user) {
        /*
         * 1) 校验username/password
         * 2) return service.login(user.getUsername(), user.getPassword())
         * 3) 可选：写session用于后台鉴权

        return null;
    }
}

 */