package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedHero;
import com.redculture.jxredculturedisplay.model.RedStory;
import com.redculture.jxredculturedisplay.service.RedHeroService;
import com.redculture.jxredculturedisplay.service.RedStoryService;
import com.redculture.jxredculturedisplay.service.RedScenicSpotService;
import com.redculture.jxredculturedisplay.service.RedExploreService;
import com.redculture.jxredculturedisplay.service.PartyEncyclopediaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // 表明这是一个提供 REST API 的控制器
@RequestMapping("/api/admin") // 所有接口前缀统一为 /api/admin
public class AdminController {

    private final RedHeroService heroService;
    private final RedStoryService storyService;
    private final RedScenicSpotService scenicSpotService;
    private final RedExploreService exploreService;
    private final PartyEncyclopediaService encyclopediaService;

    public AdminController(RedHeroService heroService, RedStoryService storyService,
                           RedScenicSpotService scenicSpotService, RedExploreService exploreService,
                           PartyEncyclopediaService encyclopediaService) {
        this.heroService = heroService;
        this.storyService = storyService;
        this.scenicSpotService = scenicSpotService;
        this.exploreService = exploreService;
        this.encyclopediaService = encyclopediaService;
    }

//    // GET /api/admin/heroes
//    @GetMapping("/heroes")
//    public List<RedHero> getHeroes() {
//        return heroService.listAll(); // 返回数据库中的所有英雄数据
//    }
//
//    // GET /api/admin/stories
//    @GetMapping("/stories")
//    public List<RedStory> getStories() {
//        return storyService.listAll(); // 返回所有故事数据
//    }
//
//    // GET /api/admin/scenicspots
//    @GetMapping("/scenicspots")
//    public List<?> getScenicSpots() {
//        return scenicSpotService.listAll();
//    }
//
//    // GET /api/admin/explore
//    @GetMapping("/explore")
//    public List<?> getExploreActivities() {
//        return exploreService.listAll();
//    }
//
//    // GET /api/admin/encyclopedias
//    @GetMapping("/encyclopedias")
//    public List<?> getEncyclopedias() {
//        return encyclopediaService.listAll();
//    }
}