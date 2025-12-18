package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "red_explore")
public class RedExplore {
    /**
     * 【实体】RedExplore（红色寻访活动）
     * 【负责人】C
     * 字段：id, title(必填), content(TEXT), date, location
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDate date;

    @Column(length = 120)
    private String location;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}