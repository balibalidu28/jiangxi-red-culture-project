package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedStory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RedStoryRepository extends JpaRepository<RedStory, Integer> {

    // 根据标题模糊查询（分页）
    Page<RedStory> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // 根据标题模糊查询（不分页）
    List<RedStory> findByTitleContainingIgnoreCase(String title);

    // 根据英雄名称查找
    List<RedStory> findByHeroNameContainingIgnoreCase(String heroName);

    // 根据地点查找
    List<RedStory> findByLocationContainingIgnoreCase(String location);

    // 根据英雄名称和地点查找
    List<RedStory> findByHeroNameContainingIgnoreCaseAndLocationContainingIgnoreCase(String heroName, String location);
}