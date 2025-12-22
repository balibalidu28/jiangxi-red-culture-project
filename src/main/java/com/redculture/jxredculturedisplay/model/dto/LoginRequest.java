package com.redculture.jxredculturedisplay.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "用户名或手机号不能为空")
    private String username; // 可以是用户名或手机号

    @NotBlank(message = "密码不能为空")
    private String password;

    private Boolean rememberMe = false;
}

