package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.ScenicSpot;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 数据访问层：景点信息数据库操作。
 */
public interface ScenicSpotRepository extends JpaRepository<ScenicSpot, Long> {
}