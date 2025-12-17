package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 数据访问层：评论数据库操作。
 */
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByScenicSpotId(Long scenicSpotId);  // 获取指定景点的评论
}