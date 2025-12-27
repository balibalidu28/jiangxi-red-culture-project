package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedExplore;
import com.redculture.jxredculturedisplay.service.RedExploreService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/explore") // 用户活动页面接口基础路径
@CrossOrigin(origins = "http://localhost:63342")
public class ExploreController {

    private final RedExploreService exploreService;

    // 构造函数注入 Explore 服务
    public ExploreController(RedExploreService exploreService) {
        this.exploreService = exploreService;
    }

    /**
     * 返回活动列表页面：
     * 页面由视图模板表示（如 Thymeleaf 的 `explore/list`）。
     */
    @GetMapping
    public String pageList(
            @RequestParam(required = false) Boolean upcoming, // 滤条件
            Model model)
    {
        // 调用服务，列出数据
        List<RedExplore> list = exploreService.list(upcoming);
        model.addAttribute("list", list); // 页面数据
        model.addAttribute("upcoming", upcoming); // 滤条件绑定
        return "explore/list"; // 指定返回页面（HTML 文件）
    }

    /**
     * 返回活动详情页面
     */
    @GetMapping("/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        // 获得具体活动详情
        RedExplore item = exploreService.getOrThrow(id);
        model.addAttribute("item", item); // 页面数据
        return "explore/detail"; // 页面模板名称
    }

    /**
     * 提供活动 JSON 列表（REST 接口）:
     * - App 或 JS 前端调用路径
     */
    @GetMapping("/api")
    @ResponseBody
    public List<RedExplore> apiList(@RequestParam(required = false) Boolean upcoming) {
        return exploreService.list(upcoming); // 返回活动 JSON
    }

    /**
     * 提供单一活动的 JSON 数据:
     * - 用于非页面数据的网络调用（如 App）。
     */
    @GetMapping("/api/{id}")
    @ResponseBody
    public RedExplore apiDetail(@PathVariable Integer id) {
        return exploreService.getOrThrow(id); // 数据查找
    }
}