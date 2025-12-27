package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedHero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RedHeroRepository extends JpaRepository<RedHero, Integer> {
    // 根据名称模糊查询红色英雄
    @Query("SELECT h FROM RedHero h WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<RedHero> findByNameContainingIgnoreCase(@Param("keyword") String keyword);

    // 还可以添加其他查询方法
    List<RedHero> findByCategory(String category);
    List<RedHero> findByBirthplaceContainingIgnoreCase(String birthplace);
}