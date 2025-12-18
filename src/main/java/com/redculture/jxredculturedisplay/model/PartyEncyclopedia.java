package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.*;

@Entity
@Table(name = "party_encyclopedia")
public class PartyEncyclopedia {
    /**
     * 【实体】PartyEncyclopedia（党史大百科）
     * 【负责人】B
     * 字段：id, title(必填), content(TEXT必填), imageUrl
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}