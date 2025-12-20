package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedHero;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/heroes") // 用户功能路径，完全独立
public class HeroController {

    // TODO: 注入 RedHeroService

    @GetMapping
    public String pageList(Model model) {
        // 用户侧页面逻辑：查询英雄列表填充页面数据
        return "hero/list";
    }

    @GetMapping("/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        // 用户侧页面逻辑：查询英雄详情填充页面数据
        return "hero/detail";
    }

    @GetMapping("/api")
    @ResponseBody
    public List<RedHero> apiList() {
        // 返回 JSON 数据
        return null;
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public RedHero apiDetail(@PathVariable Integer id) {
        // 返回英雄的 JSON 数据详情
        return null;//
    }
}