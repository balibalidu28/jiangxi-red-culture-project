package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedHero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface RedHeroRepository extends JpaRepository<RedHero, Integer> {
    // 模糊查询英雄姓名
    List<RedHero> findByNameContainingIgnoreCase(String kw);

    // 分页模糊查询
    Page<RedHero> findByNameContainingIgnoreCase(String kw, Pageable pageable);

    // 按ID升序查找前几个英雄
    List<RedHero> findTopByOrderByIdAsc(int limit);

    // 按创建时间或其他字段排序
    List<RedHero> findAllByOrderByIdDesc();
}