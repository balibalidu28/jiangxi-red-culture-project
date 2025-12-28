package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartyEncyclopediaRepository extends JpaRepository<PartyEncyclopedia, Integer> {

    // 模糊搜索标题和内容（修复：使用这个方法）
    @Query("SELECT DISTINCT p FROM PartyEncyclopedia p WHERE " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "ORDER BY p.id")
    List<PartyEncyclopedia> searchByKeyword(@Param("keyword") String keyword);

    // 获取所有词条（按ID排序）
    List<PartyEncyclopedia> findAllByOrderByIdAsc();

    // 标题包含搜索（保持兼容性）
    List<PartyEncyclopedia> findByTitleContaining(String keyword);
}