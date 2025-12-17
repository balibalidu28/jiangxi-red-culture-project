package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.ScenicSpot;
import com.redculture.jxredculturedisplay.service.ScenicSpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 控制层：处理景点相关的API请求。
 */
@RestController
@RequestMapping("/scenic-spots")
public class ScenicSpotController {

    @Autowired
    private ScenicSpotService scenicSpotService;

    /**
     * 获取所有景点信息。
     * @return 景点列表
     */
    @GetMapping
    public List<ScenicSpot> getAllScenicSpots() {
        return scenicSpotService.getAllScenicSpots();
    }

    /**
     * 添加新的景点信息。
     * @param scenicSpot 景点对象
     * @return 保存后的景点对象
     */
    @PostMapping
    public ScenicSpot addScenicSpot(@RequestBody ScenicSpot scenicSpot) {
        return scenicSpotService.addScenicSpot(scenicSpot);
    }

    /**
     * 根据ID获取景点详细信息。
     * @param id 景点ID
     * @return 景点对象
     */
    @GetMapping("/{id}")
    public ScenicSpot getScenicSpotById(@PathVariable Long id) {
        return scenicSpotService.getScenicSpotById(id);
    }

    /**
     * 根据ID删除景点信息。
     * @param id 景点ID
     */
    @DeleteMapping("/{id}")
    public void deleteScenicSpot(@PathVariable Long id) {
        scenicSpotService.deleteScenicSpot(id);
    }
}