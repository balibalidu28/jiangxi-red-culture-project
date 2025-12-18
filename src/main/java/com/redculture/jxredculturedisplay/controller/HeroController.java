package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedHero;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class HeroController {
    // TODO: 注入 RedHeroService

    @GetMapping("/heroes")
    public String pageList(Model model) {
        /* 1) heroes=service.listAll 2) model.addAttribute 3) return hero/list */
        return "hero/list";
    }

    @GetMapping("/heroes/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        /* 1) hero=service.getOrThrow 2) model.addAttribute 3) return hero/detail */
        return "hero/detail";
    }

    @GetMapping("/api/heroes")
    @ResponseBody
    public List<RedHero> apiList() {
        return null;
    }

    @GetMapping("/api/heroes/{id}")
    @ResponseBody
    public RedHero apiDetail(@PathVariable Integer id) {
        return null;
    }

    @PostMapping("/api/admin/heroes")
    @ResponseBody
    public RedHero apiCreate(@RequestBody RedHero hero) {
        return null;
    }

    @PutMapping("/api/admin/heroes/{id}")
    @ResponseBody
    public RedHero apiUpdate(@PathVariable Integer id, @RequestBody RedHero hero) {
        return null;
    }

    @DeleteMapping("/api/admin/heroes/{id}")
    public ResponseEntity<Void> apiDelete(@PathVariable Integer id) {
        return ResponseEntity.noContent().build();
    }
}