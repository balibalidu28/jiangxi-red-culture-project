package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.Comment;
import com.redculture.jxredculturedisplay.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 控制层：评论功能相关API请求。
 */
@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    /**
     * 获取指定景点的所有评论。
     */
    @GetMapping("/{scenicSpotId}")
    public List<Comment> getCommentsByScenicSpot(@PathVariable Long scenicSpotId) {
        return commentService.getCommentsByScenicSpot(scenicSpotId);
    }

    /**
     * 添加评论。
     */
    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        return commentService.addComment(comment);
    }

    /**
     * 删除评论。
     */
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }
}