// RedStory.java
package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "red_story")
public class RedStory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String title; // 标题，不能为空，长度限制为200

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // 内容，使用大对象存储，不能为空

    @Column(length = 255)
    private String source; // 来源，长度限制为255

    @Column(length = 500)
    private String imageUrl; // 图片URL，长度限制为500



    @Column(length = 500)
    private String summary; // 摘要，长度限制为500

    @Column(length = 50)
    private String storyTime; // 故事时间，长度限制为50

    @Column(length = 100)
    private String location; // 地点，长度限制为100

    @Column(length = 100)
    private String heroName; // 英雄名称，长度限制为100



    @Column(name = "created_at")
    private LocalDateTime createdAt; // 创建时间

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 更新时间

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now(); // 如果创建时间为null，则设置为当前时间
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now(); // 如果更新时间为null，则设置为当前时间
        }
//        if (viewCount == null) {
//            viewCount = 0; // 如果查看次数为null，则设置为0
//        }
//        if (isFeatured == null) {
//            isFeatured = false; // 如果是否为精选为null，则设置为false
//        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now(); // 在更新时，将更新时间设置为当前时间
    }

    // Getter 和 Setter 方法
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }


    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getStoryTime() { return storyTime; }
    public void setStoryTime(String storyTime) { this.storyTime = storyTime; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getHeroName() { return heroName; }
    public void setHeroName(String heroName) { this.heroName = heroName; }


    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}