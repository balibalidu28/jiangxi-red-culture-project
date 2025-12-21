package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedHero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RedHeroRepository extends JpaRepository<RedHero, Integer> {
    // 根据名称模糊查询红色英雄
    List<RedHero> findByNameContainingIgnoreCase(@Param("kw") String kw);
}