package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedHero;
import com.redculture.jxredculturedisplay.service.RedHeroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@RestController
@RequestMapping("/heroes")
public class HeroController {

    @Autowired
    private RedHeroService redHeroService;

    /** ------- 页面视图 ------- */
    @GetMapping
    public String pageList(Model model) {
        List<RedHero> heroes = redHeroService.listAll();
        model.addAttribute("heroes", heroes);
        return "hero/list";
    }

    @GetMapping("/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        RedHero hero = redHeroService.getOrThrow(id);
        model.addAttribute("hero", hero);
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
        return redHeroService.update(id, hero);
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
        String dirPath = System.getProperty("user.dir") + "/uploads/images/hero/";
        Files.createDirectories(Path.of(dirPath));

        String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'));
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
        return resp;
    }
}