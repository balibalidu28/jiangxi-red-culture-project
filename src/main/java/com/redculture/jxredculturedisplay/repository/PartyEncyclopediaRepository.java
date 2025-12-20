package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartyEncyclopediaRepository extends JpaRepository<PartyEncyclopedia, Long> {

    // 原来的只搜标题
    List<PartyEncyclopedia> findByTitleContaining(String keyword);

    /**
     * 【新增】高级搜索：同时搜标题 OR 内容
     * IgnoreCase 表示忽略大小写（搜 "red" 能搜到 "Red"）
     * 翻译成SQL: SELECT * FROM table WHERE lower(title) LIKE %kw% OR lower(content) LIKE %kw%
     */
    List<PartyEncyclopedia> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String titleKw, String contentKw);
}