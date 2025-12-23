package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedHero;
import com.redculture.jxredculturedisplay.service.RedHeroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/heroes")
public class HeroController {

    @Autowired
    private RedHeroService redHeroService;

    /**
     * 用户侧页面逻辑：查询英雄列表填充页面数据
     * @param model 页面模型
     * @return 视图名称
     */
    @GetMapping
    public String pageList(Model model) {
        List<RedHero> heroes = redHeroService.listAll();
        model.addAttribute("heroes", heroes);
        return "hero/list";
    }

    /**
     * 用户侧页面逻辑：查询英雄详情填充页面数据
     * @param id 英雄的 ID
     * @param model 页面模型
     * @return 视图名称
     */
    @GetMapping("/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        RedHero hero = redHeroService.getOrThrow(id);
        model.addAttribute("hero", hero);
        return "hero/detail";
    }

    /**
     * 返回 JSON 数据
     * @return 英雄列表
     */
    @GetMapping("/api")
    @ResponseBody
    public List<RedHero> apiList() {
        return redHeroService.listAll();
    }

    /**
     * 返回英雄的 JSON 数据详情
     * @param id 英雄的 ID
     * @return 英雄实体
     */
    @GetMapping("/api/{id}")
    @ResponseBody
    public RedHero apiDetail(@PathVariable Integer id) {
        return redHeroService.getOrThrow(id);
    }

    /**
     * 创建一个新的红色英雄
     * @param hero 红色英雄实体
     * @return 创建后的红色英雄实体
     */
    @PostMapping("/api")
    @ResponseBody
    public RedHero apiCreate(@RequestBody RedHero hero) {
        return redHeroService.create(hero);
    }

    /**
     * 更新一个红色英雄的信息
     * @param id 红色英雄的 ID
     * @param hero 红色英雄实体
     * @return 更新后的红色英雄实体
     */
    @PutMapping("/api/{id}")
    @ResponseBody
    public RedHero apiUpdate(@PathVariable Integer id, @RequestBody RedHero hero) {
        return redHeroService.update(id, hero);
    }

    /**
     * 删除一个红色英雄
     * @param id 红色英雄的 ID
     */
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public void apiDelete(@PathVariable Integer id) {
        redHeroService.delete(id);
    }
}