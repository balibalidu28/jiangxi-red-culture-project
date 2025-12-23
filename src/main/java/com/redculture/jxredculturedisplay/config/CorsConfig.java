package com.redculture.jxredculturedisplay.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * 配置跨域支持
     * 允许前端（如localhost:63342）正常与后端通信
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 匹配所有路径
                .allowedOrigins("http://localhost:63342") // 替换为你的前端地址
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的 HTTP 方法
                .allowedHeaders("*") // 允许的请求头
                .allowCredentials(true) // 支持携带认证信息（如 Cookie 或 Headers）
                .maxAge(3600); // 预检请求（OPTIONS）的缓存时间（单位：秒）
    }
}