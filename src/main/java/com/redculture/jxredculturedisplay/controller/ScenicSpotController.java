package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedScenicSpot;
import com.redculture.jxredculturedisplay.service.RedScenicSpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ScenicSpotController {

    @Autowired
    private RedScenicSpotService service;

    // ==========================================
    // 页面跳转接口 (给用户看)
    // ==========================================

    /**
     * 列表页
     * URL: /scenicspots 或 /scenicspots?location=井冈山
     */
    @GetMapping("/scenicspots")
    public String pageList(@RequestParam(required = false) String location, Model model) {
        // 1. 调 Service 查数据
        List<RedScenicSpot> list = service.list(location);

        // 2. 存数据到 Model
        model.addAttribute("spots", list);       // 列表数据
        model.addAttribute("currentLoc", location); // 回显当前选中的地点

        // 3. 返回视图
        return "scenic/list";
    }

    /**
     * 详情页 (RESTful 风格)
     * URL: /scenicspots/1
     */
    @GetMapping("/scenicspots/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        // 1. 调 Service 查单个
        RedScenicSpot spot = service.getOrThrow(id);

        // 2. 存数据
        model.addAttribute("spot", spot);

        // 3. 返回视图
        return "scenic/detail";
    }

    // ==========================================
    // API 接口 (给管理员/AJAX用，返回 JSON数据)
    // ==========================================

    @GetMapping("/api/scenicspots")
    @ResponseBody
    public List<RedScenicSpot> apiList(@RequestParam(required = false) String location) {
        return service.list(location);
    }

    @GetMapping("/api/scenicspots/{id}")
    @ResponseBody
    public RedScenicSpot apiDetail(@PathVariable Integer id) {
        return service.getOrThrow(id);
    }

    @PostMapping("/api/admin/scenicspots")
    @ResponseBody
    public RedScenicSpot apiCreate(@RequestBody RedScenicSpot spot) {
        return service.create(spot);
    }

    @PutMapping("/api/admin/scenicspots/{id}")
    @ResponseBody
    public RedScenicSpot apiUpdate(@PathVariable Integer id, @RequestBody RedScenicSpot spot) {
        return service.update(id, spot);
    }

    @DeleteMapping("/api/admin/scenicspots/{id}")
    @ResponseBody
    public void apiDelete(@PathVariable Integer id) {
        service.delete(id);
    }
}