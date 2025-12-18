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
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 120)
    private String location;

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