package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedHero;
import com.redculture.jxredculturedisplay.service.RedHeroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/heroes") // 用户功能路径，完全独立
public class HeroController {

    @Autowired
    private RedHeroService redHeroService;

    @GetMapping
    public String pageList(
            @RequestParam(value = "kw", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "12") int size,
            @RequestParam(value = "sort", defaultValue = "default") String sortType,
            Model model) {

        // 处理排序
        Sort sort;
        switch (sortType) {
            case "name":
                sort = Sort.by("name").ascending();
                break;
            case "id":
                sort = Sort.by("id").descending();
                break;
            default:
                sort = Sort.by("id").descending();
        }

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        // 搜索或获取所有
        Page<RedHero> heroPage = redHeroService.searchByName(keyword, pageable);

        // 添加模型属性
        model.addAttribute("heroes", heroPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", heroPage.getTotalPages());
        model.addAttribute("totalHeroes", heroPage.getTotalElements());
        model.addAttribute("pageSize", size);
        model.addAttribute("keyword", keyword);
        model.addAttribute("sortType", sortType);

        return "hero/list";
    }

    @GetMapping("/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        // 获取英雄详情
        RedHero hero = redHeroService.getOrThrow(id);

        // 获取相关英雄（排除当前英雄，最多显示3个）
        List<RedHero> relatedHeroes = redHeroService.findRelatedHeroes(id, 3);

        // 获取相邻英雄（用于上/下一个导航）
        RedHero prevHero = redHeroService.getPrevHero(id);
        RedHero nextHero = redHeroService.getNextHero(id);

        // 添加到模型
        model.addAttribute("hero", hero);
        model.addAttribute("relatedHeroes", relatedHeroes);
        model.addAttribute("prevHero", prevHero);
        model.addAttribute("nextHero", nextHero);

        return "hero/detail";
    }

    @GetMapping("/api")
    @ResponseBody
    public List<RedHero> apiList() {
        // 返回所有英雄的 JSON 数据
        return redHeroService.listAll();
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public RedHero apiDetail(@PathVariable Integer id) {
        // 返回英雄的 JSON 数据详情
        return redHeroService.getOrThrow(id);
    }

    // 添加搜索API接口
    @GetMapping("/api/search")
    @ResponseBody
    public List<RedHero> apiSearch(@RequestParam(value = "kw", required = false) String keyword) {
        return redHeroService.searchByName(keyword);
    }

    // 获取热门英雄（用于首页展示）
    @GetMapping("/api/top/{n}")
    @ResponseBody
    public List<RedHero> apiTop(@PathVariable int n) {
        return redHeroService.listTop(n);
    }
}