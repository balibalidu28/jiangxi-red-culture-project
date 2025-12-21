package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.*;
import com.redculture.jxredculturedisplay.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin") // 后台管理路径的唯一前缀
public class AdminController {

    private final RedHeroService heroService;
    private final RedStoryService storyService;
    private final RedScenicSpotService scenicSpotService;
    private final RedExploreService exploreService;
    private final PartyEncyclopediaService encyclopediaService;

    // 通过构造函数注入所有相关服务
    public AdminController(
            RedHeroService heroService,
            RedStoryService storyService,
            RedScenicSpotService scenicSpotService,
            RedExploreService exploreService,
            PartyEncyclopediaService encyclopediaService
    ) {
        this.heroService = heroService;
        this.storyService = storyService;
        this.scenicSpotService = scenicSpotService;
        this.exploreService = exploreService;
        this.encyclopediaService = encyclopediaService;
    }

    // ========================== 英雄管理功能 ==========================

    // 获取所有英雄
    @GetMapping("/heroes")
    public List<RedHero> getAllHeroes() {
        return heroService.listAll();
    }

    // 创建一个英雄
    @PostMapping("/heroes")
    public RedHero createHero(@RequestBody RedHero hero) {
        return heroService.save(hero);
    }

    // 更新英雄
    @PutMapping("/heroes/{id}")
    public RedHero updateHero(@PathVariable Integer id, @RequestBody RedHero heroDetails) {
        return heroService.update(id, heroDetails);
    }

    // 删除英雄
    @DeleteMapping("/heroes/{id}")
    public void deleteHero(@PathVariable Integer id) {
        heroService.deleteById(id);
    }

    // ========================== 活动管理功能 ==========================

    // 获取所有活动
    @GetMapping("/explore")
    public List<RedExplore> getAllExplores() {
        return exploreService.listAll();
    }

    // 创建一个活动
    @PostMapping("/explore")
    public RedExplore createExplore(@RequestBody RedExplore explore) {
        return exploreService.save(explore);
    }

    // 更新活动
    @PutMapping("/explore/{id}")
    public RedExplore updateExplore(@PathVariable Integer id, @RequestBody RedExplore exploreDetails) {
        return exploreService.update(id, exploreDetails);
    }

    // 删除活动
    @DeleteMapping("/explore/{id}")
    public void deleteExplore(@PathVariable Integer id) {
        exploreService.deleteById(id);
    }

    // ========================== 故事管理功能 ==========================

    // 获取所有故事
    @GetMapping("/stories")
    public List<RedStory> getAllStories() {
        return storyService.listAll();
    }

    // 添加故事
    @PostMapping("/stories")
    public RedStory createStory(@RequestBody RedStory story) {
        return storyService.save(story);
    }

    // 修改故事
    @PutMapping("/stories/{id}")
    public RedStory updateStory(@PathVariable Integer id, @RequestBody RedStory storyDetails) {
        return storyService.update(id, storyDetails);
    }

    // 删除故事
    @DeleteMapping("/stories/{id}")
    public void deleteStory(@PathVariable Integer id) {
        storyService.deleteById(id);
    }

    // ========================== 红色圣地管理功能 ==========================

    // 获取所有圣地
    @GetMapping("/scenicspots")
    public List<RedScenicSpot> getAllScenicSpots() {
        return scenicSpotService.listAll();
    }

    // 创建圣地
    @PostMapping("/scenicspots")
    public RedScenicSpot createScenicSpot(@RequestBody RedScenicSpot scenicSpot) {
        System.out.println("接收到的数据: " + scenicSpot.toString());
        return scenicSpotService.create(scenicSpot);
    }

    // 更新圣地信息
    @PutMapping("/scenicspots/{id}")
    public RedScenicSpot updateScenicSpot(@PathVariable Integer id, @RequestBody RedScenicSpot scenicSpotDetails) {
        return scenicSpotService.update(id, scenicSpotDetails);
    }

    // 删除圣地
    @DeleteMapping("/scenicspots/{id}")
    public void deleteScenicSpot(@PathVariable Integer id) {
        scenicSpotService.delete(id);
    }

    // ========================== 百科管理功能 ==========================

    // 获取所有百科条目
    @GetMapping("/encyclopedias")
    public List<PartyEncyclopedia> getAllEncyclopedias() {
        return encyclopediaService.listAll();
    }

    // 获取单个百科条目
    @GetMapping("/encyclopedias/{id}")
    public PartyEncyclopedia getEncyclopedia(@PathVariable Integer id) {
        return encyclopediaService.getOrThrow(Long.valueOf(id));
    }

    // 创建百科条目
    @PostMapping("/encyclopedias")
    public PartyEncyclopedia createEncyclopedia(@RequestBody PartyEncyclopedia encyclopedia) {
        return encyclopediaService.create(encyclopedia);
    }

    // 更新百科条目
    @PutMapping("/encyclopedias/{id}")
    public PartyEncyclopedia updateEncyclopedia(@PathVariable Integer id, @RequestBody PartyEncyclopedia encyclopediaDetails) {
        return encyclopediaService.update(Long.valueOf(id), encyclopediaDetails);
    }

    // 删除百科条目
    @DeleteMapping("/encyclopedias/{id}")
    public void deleteEncyclopedia(@PathVariable Integer id) {
        encyclopediaService.delete(Long.valueOf(id));
    }
}