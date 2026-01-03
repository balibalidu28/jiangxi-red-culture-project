package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedScenicSpot;
import com.redculture.jxredculturedisplay.repository.RedScenicSpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

/**
 * 【业务层】RedScenicSpotService
 * 负责处理红色圣地的增删改查逻辑
 */
@Service
public class RedScenicSpotService {

    @Autowired
    private RedScenicSpotRepository repository; // 注入仓库

    /**
     * 前台列表查询（带筛选逻辑和排序）
     * @param location 如果为空则查全部，不为空则模糊查
     */
    public List<RedScenicSpot> list(String location) {
        if (location == null || location.trim().isEmpty()) {
            // 返回所有数据，按ID升序排序
            return repository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        } else {
            // 按地点筛选，然后手动排序
            List<RedScenicSpot> filtered = repository.findByLocationContaining(location);
            // 按ID升序排序
            filtered.sort(Comparator.comparing(RedScenicSpot::getId));
            return filtered;
        }
    }






    /**
     * 统计总数
     */
    public long count() {
        return repository.count();
    }

    /**
     * 首页推荐用（最新N条）
     */
    public List<RedScenicSpot> listTop(int n) {
        return repository.findAll(
                PageRequest.of(0, n, Sort.by(Sort.Direction.DESC, "id"))
        ).getContent();
    }

    /**
     * 【新增方法】获取所有数据（无筛选）
     * 专门给 AdminController 的 listAll() 调用
     */
    public List<RedScenicSpot> listAll() {
        return repository.findAll();
    }



    /**
     * 获取详情，找不到抛异常
     */
    public RedScenicSpot getOrThrow(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("未找到ID为 " + id + " 的红色圣地"));
    }

    /**
     * 新增
     */
    public RedScenicSpot create(RedScenicSpot spot) {
        if (spot.getName() == null || spot.getName().isEmpty()) {
            throw new RuntimeException("圣地名称不能为空");
        }
        spot.setId(null); // 确保是新增
        return repository.save(spot);
    }

    /**
     * 修改
     */
    public RedScenicSpot update(Integer id, RedScenicSpot spot) {
        System.out.println("=== Service.update() 开始 ===");
        System.out.println("要更新的ID: " + id);
        System.out.println("传入的数据:");
        System.out.println("  name: " + spot.getName());
        System.out.println("  location: " + spot.getLocation());
        System.out.println("  description: " + spot.getDescription());
        System.out.println("  imageUrl: " + spot.getImageUrl());

        RedScenicSpot dbSpot = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("未找到ID为 " + id + " 的红色圣地"));

        System.out.println("数据库中原有数据:");
        System.out.println("  name: " + dbSpot.getName());
        System.out.println("  location: " + dbSpot.getLocation());
        System.out.println("  imageUrl: " + dbSpot.getImageUrl());

        // 更新字段
        if (spot.getName() != null) {
            dbSpot.setName(spot.getName());
        }
        if (spot.getLocation() != null) {
            dbSpot.setLocation(spot.getLocation());
        }
        if (spot.getDescription() != null) {
            dbSpot.setDescription(spot.getDescription());
        }
        if (spot.getImageUrl() != null) {
            dbSpot.setImageUrl(spot.getImageUrl());
        }

        RedScenicSpot saved = repository.save(dbSpot);

        System.out.println("更新后的数据:");
        System.out.println("  name: " + saved.getName());
        System.out.println("  location: " + saved.getLocation());
        System.out.println("  imageUrl: " + saved.getImageUrl());
        System.out.println("=== Service.update() 结束 ===");

        return saved;
    }

    /**
     * 删除
     */
    public void delete(Integer id) {
        getOrThrow(id);
        repository.deleteById(id);
    }

    public RedScenicSpot save(RedScenicSpot scenicSpot) {
        return repository.save(scenicSpot);
    }
}