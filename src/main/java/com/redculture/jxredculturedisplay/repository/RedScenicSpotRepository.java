package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedScenicSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 【仓库层】
 * 负责数据库操作，无需手写 SQL 语句
 */
public interface RedScenicSpotRepository extends JpaRepository<RedScenicSpot, Integer> {

    /**
     * 【核心功能】根据地点筛选
     * Spring Data JPA 会自动翻译成：
     * SELECT * FROM red_scenic_spot WHERE location LIKE %loc%
     * @param loc 地点名称
     * @return 符合该地点的圣地列表
     */
    List<RedScenicSpot> findByLocationContaining(String loc);
}