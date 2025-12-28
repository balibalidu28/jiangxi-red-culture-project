package com.redculture.jxredculturedisplay.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // hero
        registry.addResourceHandler("/images/hero/**")
                .addResourceLocations(
                        "classpath:/static/images/hero/",
                        "file:./src/main/resources/static/images/hero/",
                        "file:./static/images/hero/"
                );

        // explore
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

        // ✅ stories (注意：你的 StoryController 保存目录是 static/images/stories/，URL 也是 /images/stories/)
        registry.addResourceHandler("/images/stories/**")
                .addResourceLocations(
                        "classpath:/static/images/stories/",
                        "file:./src/main/resources/static/images/stories/",
                        "file:./static/images/stories/"
                );

        // ✅ scenic
        registry.addResourceHandler("/images/scenic/**")
                .addResourceLocations(
                        "classpath:/static/images/scenic/",
                        "file:./src/main/resources/static/images/scenic/",
                        "file:./static/images/scenic/"
                );

        // ✅ encyclopedia
        registry.addResourceHandler("/images/encyclopedia/**")
                .addResourceLocations(
                        "classpath:/static/images/encyclopedia/",
                        "file:./src/main/resources/static/images/encyclopedia/",
                        "file:./static/images/encyclopedia/"
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