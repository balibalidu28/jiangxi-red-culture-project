package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.*;

@Entity
@Table(name = "red_scenic_spot")
public class RedScenicSpot {
    /**
     * 【实体】RedScenicSpot（红色圣地）
     * 【负责人】B
     * 字段：id, name(必填), description(TEXT), location, imageUrl
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 120)
    private String name; // 地点名称，如：井冈山革命博物馆

    @Column(columnDefinition = "TEXT")// 大文本类型，可以存很长的历史介绍
    private String description;// 简介/历史意义

    @Column(length = 120)
    private String location;// 所属地区，如：井冈山、南昌

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}