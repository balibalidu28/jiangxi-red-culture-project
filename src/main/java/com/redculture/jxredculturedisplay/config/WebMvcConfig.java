package com.redculture.jxredculturedisplay.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String userPath = System.getProperty("user.dir") + "/uploads/images/user/";
        registry.addResourceHandler("/images/user/**")
                .addResourceLocations("file:" + userPath);

        String storyPath = System.getProperty("user.dir") + "/uploads/images/story/";
        registry.addResourceHandler("/images/story/**")
                .addResourceLocations("file:" + storyPath);
    }
}