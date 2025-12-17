package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 数据模型：评论信息。
 */
@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 主键ID

    @ManyToOne
    @JoinColumn(name = "scenic_spot_id")
    private ScenicSpot scenicSpot;  // 关联的景点

    private String userName;  // 评论用户名
    private String content;  // 评论内容

    @CreationTimestamp
    private LocalDateTime createdAt;  // 评论时间
}