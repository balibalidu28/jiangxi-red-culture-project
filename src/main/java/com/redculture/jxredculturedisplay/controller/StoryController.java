// StoryController.java
package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedStory;
import com.redculture.jxredculturedisplay.service.RedStoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/stories")
public class StoryController {

    @Autowired
    private RedStoryService redStoryService;

    /**
     * 显示故事列表页面（带搜索和分页）
     */
    @GetMapping("")
    public String storyList(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size,
            @RequestParam(value = "kw", required = false) String keyword,
            Model model) {

        // 获取分页数据
        Page<RedStory> storyPage = redStoryService.getStoriesByPage(page, size, keyword);

        // 获取推荐故事
        List<RedStory> featuredStories = redStoryService.getFeaturedStories(3);

        // 获取故事总数
        long totalCount = redStoryService.getTotalCount();

        // 添加到模型
        model.addAttribute("stories", storyPage.getContent());
        model.addAttribute("featuredStories", featuredStories);
        model.addAttribute("totalItems", totalCount);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", storyPage.getTotalPages());
        model.addAttribute("pageSize", size);
        model.addAttribute("searchKeyword", keyword != null ? keyword : "");

        return "story/list";
    }

    /**
     * 显示故事详情页面
     */
    @GetMapping("/{id}")
    public String storyDetail(@PathVariable("id") Integer id, Model model) {
        try {
            // 获取故事详情
            RedStory story = redStoryService.getStoryById(id);

            // 获取相关故事
            List<RedStory> relatedStories = redStoryService.getRelatedStories(story, 3);

            // 添加到模型
            model.addAttribute("story", story);
            model.addAttribute("relatedStories", relatedStories);

            return "story/detail";

        } catch (RuntimeException e) {
            // 如果故事不存在，重定向到列表页
            return "redirect:/stories";
        }
    }

    /**
     * REST API：获取故事列表（JSON格式）
     */
    @GetMapping("/api")
    @ResponseBody
    public Page<RedStory> getStoriesApi(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "kw", required = false) String keyword) {
        return redStoryService.getStoriesByPage(page, size, keyword);
    }

    /**
     * REST API：获取单个故事详情
     */
    @GetMapping("/api/{id}")
    @ResponseBody
    public RedStory getStoryApi(@PathVariable("id") Integer id) {
        return redStoryService.getStoryById(id);
    }

    /**
     * REST API：获取推荐故事
     */
    @GetMapping("/api/featured")
    @ResponseBody
    public List<RedStory> getFeaturedStoriesApi(
            @RequestParam(value = "limit", defaultValue = "3") int limit) {
        return redStoryService.getFeaturedStories(limit);
    }

    /**
     * REST API：获取最新故事
     */
    @GetMapping("/api/latest")
    @ResponseBody
    public List<RedStory> getLatestStoriesApi(
            @RequestParam(value = "limit", defaultValue = "5") int limit) {
        return redStoryService.getLatestStories(limit);
    }

    /**
     * REST API：根据英雄名称搜索故事
     */
    @GetMapping("/api/hero/{heroName}")
    @ResponseBody
    public List<RedStory> getStoriesByHeroApi(
            @PathVariable("heroName") String heroName,
            @RequestParam(value = "limit", defaultValue = "10") int limit) {
        return redStoryService.getStoriesByHeroName(heroName, limit);
    }
}