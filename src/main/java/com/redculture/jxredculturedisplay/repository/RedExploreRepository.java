package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedExplore;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RedExploreRepository extends JpaRepository<RedExplore, Long>{
    // 按开始时间升序获取所有活动
    List<RedExplore> findAllByOrderByStartTimeAsc();

    // 获取开始时间在指定时间之后的活动（即将开始）
    List<RedExplore> findByStartTimeAfterOrderByStartTimeAsc(LocalDateTime dateTime);

    // 获取结束时间在指定时间之前的活动（已结束）
    List<RedExplore> findByEndTimeBeforeOrderByStartTimeAsc(LocalDateTime dateTime);

    // 获取结束时间在指定时间之前且状态不是ENDED的活动
    List<RedExplore> findByEndTimeBeforeAndStatusNot(LocalDateTime dateTime, RedExplore.ActivityStatus status);

    // 获取前N个活动（按开始时间升序）
    @Query("SELECT e FROM RedExplore e ORDER BY e.startTime ASC")
    List<RedExplore> findTopNByOrderByStartTimeAsc(@Param("limit") int limit);

    // 搜索活动
    @Query("SELECT e FROM RedExplore e WHERE " +
            "LOWER(e.title) LIKE LOWER(:keyword) OR " +
            "LOWER(e.city) LIKE LOWER(:keyword) OR " +
            "LOWER(e.location) LIKE LOWER(:keyword) " +
            "ORDER BY e.startTime ASC")
    List<RedExplore> searchByTitleOrCityOrLocation(@Param("keyword") String keyword);

    // 可选：分页查询
    // Page<RedExplore> findAllByOrderByStartTimeAsc(Pageable pageable);
}