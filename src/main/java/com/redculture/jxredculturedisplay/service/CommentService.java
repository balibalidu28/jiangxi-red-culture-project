package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.Comment;
import com.redculture.jxredculturedisplay.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 服务层：评论业务逻辑。
 */
@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getCommentsByScenicSpot(Long scenicSpotId) {
        return commentRepository.findByScenicSpotId(scenicSpotId);
    }

    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}