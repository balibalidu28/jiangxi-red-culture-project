package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.*;

@Entity
@Table(name = "red_hero")
public class RedHero {
    /**
     * 【实体】RedHero（红色英雄）
     * 【负责人】A
     * 字段：id, name(必填), description(TEXT), imageUrl
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}