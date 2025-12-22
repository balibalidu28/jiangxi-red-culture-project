// RedStoryRepository.java
package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedStory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RedStoryRepository extends JpaRepository<RedStory, Integer> {

    // 方法1：关键词模糊搜索（多字段）
    @Query("SELECT s FROM RedStory s WHERE " +
            "LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.summary) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.heroName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.location) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<RedStory> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 方法2：按创建时间倒序排列（用于分页查询）
    Page<RedStory> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // 方法3：获取推荐的故事
    List<RedStory> findByIsFeaturedTrueOrderByCreatedAtDesc();

    // 方法4：获取最新的N个故事
    @Query("SELECT s FROM RedStory s ORDER BY s.createdAt DESC")
    List<RedStory> findLatestStories(Pageable pageable);

    // 方法5：根据英雄名称模糊查询
    @Query("SELECT s FROM RedStory s WHERE LOWER(s.heroName) LIKE LOWER(CONCAT('%', :heroName, '%'))")
    Page<RedStory> findByHeroName(@Param("heroName") String heroName, Pageable pageable);

    // 方法6：根据英雄名称模糊查询（不分页）
    @Query("SELECT s FROM RedStory s WHERE LOWER(s.heroName) LIKE LOWER(CONCAT('%', :heroName, '%'))")
    List<RedStory> findByHeroName(@Param("heroName") String heroName);

    // 方法7：统计故事总数
    @Query("SELECT COUNT(s) FROM RedStory s")
    Long countAllStories();
}