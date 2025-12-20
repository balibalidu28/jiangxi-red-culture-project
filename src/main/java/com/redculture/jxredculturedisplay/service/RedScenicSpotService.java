package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedScenicSpot;
import com.redculture.jxredculturedisplay.repository.RedScenicSpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
     * 前台列表查询（带筛选逻辑）
     * @param location 如果为空则查全部，不为空则模糊查
     */
    public List<RedScenicSpot> list(String location) {
        if (location == null || location.trim().isEmpty()) {
            return repository.findAll();
        } else {
            return repository.findByLocationContaining(location);
        }
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
        RedScenicSpot dbSpot = getOrThrow(id);
        dbSpot.setName(spot.getName());
        dbSpot.setDescription(spot.getDescription());
        dbSpot.setLocation(spot.getLocation());
        dbSpot.setImageUrl(spot.getImageUrl());
        return repository.save(dbSpot);
    }

    /**
     * 删除
     */
    public void delete(Integer id) {
        getOrThrow(id);
        repository.deleteById(id);
    }
}