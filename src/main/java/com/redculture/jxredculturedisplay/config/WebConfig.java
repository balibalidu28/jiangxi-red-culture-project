package com.redculture.jxredculturedisplay.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 静态资源映射
        registry.addResourceHandler("/images/hero/**")
                .addResourceLocations(
                        "classpath:/static/images/hero/",
                        "file:./src/main/resources/static/images/hero/",
                        "file:./static/images/hero/"
                );
        registry.addResourceHandler("/images/explore/**")
                .addResourceLocations(
                        "classpath:/static/images/explore/",
                        "file:./src/main/resources/static/images/explore/",
                        "file:./static/images/explore/"
                );
        registry.addResourceHandler("/files/explore/**")
                .addResourceLocations(
                        "classpath:/static/files/explore/",
                        "file:./src/main/resources/static/files/explore/",
                        "file:./static/files/explore/"
                );
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CORS配置
        registry.addMapping("/**")  // 所有接口
                .allowedOrigins("http://localhost:63342")  // 前端地址
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}