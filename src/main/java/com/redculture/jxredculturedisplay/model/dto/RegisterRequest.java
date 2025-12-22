package com.redculture.jxredculturedisplay.model.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "请输入有效的11位手机号码")
    private String phone;

    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 16, message = "用户名长度应为2-16个字符")
    @Pattern(regexp = "^[\\u4e00-\\u9fa5a-zA-Z0-9_]+$", message = "用户名只能包含中文、字母、数字和下划线")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 8, max = 24, message = "密码长度应为8-24个字符")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).+$", message = "密码必须包含字母和数字")
    private String password;

    @NotBlank(message = "确认密码不能为空")
    private String confirmPassword;

    @AssertTrue(message = "请同意用户服务协议和隐私政策")
    private Boolean agreeTerms;
}
