package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedExplore;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ExploreController {
    // TODO: 注入 RedExploreService

    @GetMapping("/explore")
    public String pageList(@RequestParam(required = false) Boolean upcoming, Model model) {
        /*
         * 1) list = service.list(upcoming)
         * 2) model.addAttribute("list", list)
         * 3) model.addAttribute("upcoming", upcoming)
         * 4) return "explore/list"
         */
        return "explore/list";
    }

    @GetMapping("/explore/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        /*
         * 1) item = service.getOrThrow(id)
         * 2) model.addAttribute("item", item)
         * 3) return "explore/detail"
         */
        return "explore/detail";
    }

    @GetMapping("/api/explore")
    @ResponseBody
    public List<RedExplore> apiList(@RequestParam(required = false) Boolean upcoming) {
        /* 1) return service.list(upcoming) */
        return null;
    }

    @GetMapping("/api/explore/{id}")
    @ResponseBody
    public RedExplore apiDetail(@PathVariable Integer id) {
        /* 1) return service.getOrThrow(id) */
        return null;
    }

    @PostMapping("/api/admin/explore")
    @ResponseBody
    public RedExplore apiCreate(@RequestBody RedExplore item) {
        /* 1) return service.create(item) */
        return null;
    }

    @PutMapping("/api/admin/explore/{id}")
    @ResponseBody
    public RedExplore apiUpdate(@PathVariable Integer id, @RequestBody RedExplore item) {
        /* 1) return service.update(id, item) */
        return null;
    }

    @DeleteMapping("/api/admin/explore/{id}")
    @ResponseBody
    public void apiDelete(@PathVariable Integer id) {
        /* 1) service.delete(id) */
    }
}