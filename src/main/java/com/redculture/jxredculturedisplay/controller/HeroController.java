package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedHero;
import com.redculture.jxredculturedisplay.service.RedHeroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Controller
@RequestMapping("/heroes")
@CrossOrigin(origins = "http://localhost:63342")
public class HeroController {

    @Autowired
    private RedHeroService redHeroService;

    /** ------- 页面视图 ------- */
    @GetMapping
    public String pageList(
            @RequestParam(required = false) String kw,
            @RequestParam(defaultValue = "default") String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size,
            Model model) {

        // 搜索功能
        List<RedHero> heroes;
        if (kw != null && !kw.trim().isEmpty()) {
            heroes = redHeroService.searchHeroesByName(kw);
        } else {
            heroes = redHeroService.listAll();
        }

        // 排序功能
        if ("name".equals(sort)) {
            heroes.sort(Comparator.comparing(RedHero::getName));
        } else if ("time".equals(sort)) {
            heroes.sort(Comparator.comparing(RedHero::getBirthDate));
        }

        // 分页功能
        int totalHeroes = heroes.size();
        int totalPages = (int) Math.ceil((double) totalHeroes / size);
        int startIndex = (page - 1) * size;
        int endIndex = Math.min(startIndex + size, totalHeroes);

        List<RedHero> pageHeroes = heroes.subList(startIndex, endIndex);

        // 添加上下一位英雄信息（用于详情页导航）
        RedHero currentHero = null;
        if (pageHeroes.size() > 0) {
            currentHero = pageHeroes.get(0);
        }

        model.addAttribute("heroes", pageHeroes);
        model.addAttribute("totalHeroes", totalHeroes);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", size);
        model.addAttribute("keyword", kw);
        model.addAttribute("sortType", sort);

        return "hero/list";
    }

    @GetMapping("/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        RedHero hero = redHeroService.getOrThrow(id);
        model.addAttribute("hero", hero);

        // 添加上下一位英雄信息
        List<RedHero> allHeroes = redHeroService.listAll();
        int currentIndex = -1;
        for (int i = 0; i < allHeroes.size(); i++) {
            if (allHeroes.get(i).getId().equals(id)) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex > 0) {
            model.addAttribute("prevHero", allHeroes.get(currentIndex - 1));
        }
        if (currentIndex < allHeroes.size() - 1) {
            model.addAttribute("nextHero", allHeroes.get(currentIndex + 1));
        }

        return "hero/detail";
    }

    /** ------- 后台管理 API ------- */
    @GetMapping("/api")
    @ResponseBody
    public List<RedHero> apiList() {
        return redHeroService.listAll();
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public RedHero apiDetail(@PathVariable Integer id) {
        return redHeroService.getOrThrow(id);
    }

    @PostMapping("/api")
    @ResponseBody
    public RedHero apiCreate(@RequestBody RedHero hero) {
        return redHeroService.create(hero);
    }

    @PutMapping("/api/{id}")
    @ResponseBody
    public RedHero apiUpdate(@PathVariable Integer id, @RequestBody RedHero hero) {
        // 需要更新所有字段
        RedHero existingHero = redHeroService.getOrThrow(id);
        existingHero.setName(hero.getName());
        existingHero.setDescription(hero.getDescription());
        existingHero.setImageUrl(hero.getImageUrl());
        existingHero.setAlias(hero.getAlias());
        existingHero.setTitle(hero.getTitle());
        existingHero.setCategory(hero.getCategory());
        existingHero.setContent(hero.getContent());
        existingHero.setGender(hero.getGender());
        existingHero.setEthnicity(hero.getEthnicity());
        existingHero.setBirthDate(hero.getBirthDate());
        existingHero.setDeathDate(hero.getDeathDate());
        existingHero.setBirthplace(hero.getBirthplace());
        existingHero.setPoliticalStatus(hero.getPoliticalStatus());

        return redHeroService.save(existingHero);
    }

    @DeleteMapping("/api/{id}")
    @ResponseBody
    public void apiDelete(@PathVariable Integer id) {
        redHeroService.delete(id);
    }

    /** ------- 图片上传API: /heroes/api/{id}/upload-image ------- */
    @PostMapping("/api/{id}/upload-image")
    @ResponseBody
    public Map<String, Object> uploadHeroImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        if (file.isEmpty()) throw new IllegalArgumentException("文件为空");

        // 保存到 /uploads/images/hero/
//        String dirPath = System.getProperty("user.dir") + "/uploads/images/hero/";
        String dirPath = System.getProperty("user.dir") + "/src/main/resources/static/images/hero/";        Files.createDirectories(Path.of(dirPath));

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf('.')) : ".jpg";
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        Path savePath = Path.of(dirPath, filename);
        file.transferTo(savePath.toFile());

        // 供前端直接可访问的路径
        String url = "/images/hero/" + filename;

        // 更新数据库 imageUrl 字段
        RedHero hero = redHeroService.getOrThrow(id);
        hero.setImageUrl(url);
        redHeroService.save(hero);

        Map<String, Object> resp = new HashMap<>();
        resp.put("url", url);
        resp.put("success", true);
        return resp;
    }
}