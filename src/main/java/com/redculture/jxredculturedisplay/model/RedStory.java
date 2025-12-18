package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "red_story")
public class RedStory {
    /**
     * 【实体】RedStory（红色故事/文章）
     * 【负责人】A
     * 字段：id, title(必填), content(TEXT必填), source, createdAt
     * 注意：createdAt用于首页“最新故事”日期显示
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(length = 255)
    private String source;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        // TODO: 创建时自动写入当前时间；如果你们希望手动控制可删除
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}