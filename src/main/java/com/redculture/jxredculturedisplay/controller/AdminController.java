package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.*;
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

    // 英雄增删改查
    @GetMapping("/heroes")
    public List<RedHero> getAllHeroes() {
        return heroService.listAll();
    }

    @PostMapping("/heroes")
    public RedHero createHero(@RequestBody RedHero hero) {
        return heroService.save(hero);
    }

    @PutMapping("/heroes/{id}")
    public RedHero updateHero(@PathVariable Integer id, @RequestBody RedHero heroDetails) {
        return heroService.update(id, heroDetails);
    }

    @DeleteMapping("/heroes/{id}")
    public void deleteHero(@PathVariable Integer id) {
        heroService.deleteById(id);
    }

    // 圣地增删改查
    @GetMapping("/scenicspots")
    public List<RedScenicSpot> getAllScenicSpots() {
        return scenicSpotService.listAll();
    }

    @PostMapping("/scenicspots")
    public RedScenicSpot createScenicSpot(@RequestBody RedScenicSpot scenicSpot) {
        return scenicSpotService.save(scenicSpot);
    }

    @PutMapping("/scenicspots/{id}")
    public RedScenicSpot updateScenicSpot(@PathVariable Integer id, @RequestBody RedScenicSpot scenicSpotDetails) {
        return scenicSpotService.update(id, scenicSpotDetails);
    }

    @DeleteMapping("/scenicspots/{id}")
    public void deleteScenicSpot(@PathVariable Integer id) {
        scenicSpotService.deleteById(id);
    }

    // 活动增删改查
    @GetMapping("/explore")
    public List<RedExplore> getAllExplores() {
        return exploreService.listAll();
    }

    @PostMapping("/explore")
    public RedExplore createExplore(@RequestBody RedExplore explore) {
        return exploreService.save(explore);
    }

    @PutMapping("/explore/{id}")
    public RedExplore updateExplore(@PathVariable Integer id, @RequestBody RedExplore exploreDetails) {
        return exploreService.update(id, exploreDetails);
    }

    @DeleteMapping("/explore/{id}")
    public void deleteExplore(@PathVariable Integer id) {
        exploreService.deleteById(id);
    }

    // 百科增删改查
    @GetMapping("/encyclopedias")
    public List<PartyEncyclopedia> getAllEncyclopedias() {
        return encyclopediaService.listAll();
    }

    @PostMapping("/encyclopedias")
    public PartyEncyclopedia createEncyclopedia(@RequestBody PartyEncyclopedia encyclopedia) {
        return encyclopediaService.save(encyclopedia);
    }

    @PutMapping("/encyclopedias/{id}")
    public PartyEncyclopedia updateEncyclopedia(@PathVariable Integer id, @RequestBody PartyEncyclopedia encyclopediaDetails) {
        return encyclopediaService.update(id, encyclopediaDetails);
    }

    @DeleteMapping("/encyclopedias/{id}")
    public void deleteEncyclopedia(@PathVariable Integer id) {
        encyclopediaService.deleteById(id);
    }
}