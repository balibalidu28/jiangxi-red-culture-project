package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.*;

@Entity//1. 告诉 Spring Boot 这是一个跟数据库对应的实体类
@Table(name = "party_encyclopedia")// 2. 表名叫啥

public class PartyEncyclopedia {
    /**
     * 【实体】PartyEncyclopedia（党史大百科）
     * 【负责人】B
     * 字段：id, title(必填), content(TEXT必填), imageUrl
     * 对应数据库表：party_encyclopedia
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//id自增策略 (MySQL)
    private Integer id;

    @Column(nullable = false, length = 120)// 标题不能为空，限制长度
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)// 加上这个，可以存很长的文章
    private String content;

    @Column(name = "image_url", length = 255)//配图
    private String imageUrl;


    // 构造函数
    public PartyEncyclopedia() {}

    public PartyEncyclopedia(String title, String content, String imageUrl) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
    }

    // Getter和Setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
