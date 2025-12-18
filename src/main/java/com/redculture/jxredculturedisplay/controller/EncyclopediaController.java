package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class EncyclopediaController {
    // TODO: 注入 PartyEncyclopediaService

    @GetMapping("/encyclopedias")
    public String pageList(@RequestParam(required = false) String kw, Model model) {
        /*
         * 1) list = service.search(kw)
         * 2) model.addAttribute("list", list)
         * 3) model.addAttribute("kw", kw)
         * 4) return "encyclopedia/list"
         */
        return "encyclopedia/list";
    }

    @GetMapping("/encyclopedias/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        /*
         * 1) item = service.getOrThrow(id)
         * 2) model.addAttribute("item", item)
         * 3) return "encyclopedia/detail"
         */
        return "encyclopedia/detail";
    }

    @GetMapping("/api/encyclopedias")
    @ResponseBody
    public List<PartyEncyclopedia> apiList(@RequestParam(required = false) String kw) {
        /* 1) return service.search(kw) */
        return null;
    }

    @GetMapping("/api/encyclopedias/{id}")
    @ResponseBody
    public PartyEncyclopedia apiDetail(@PathVariable Integer id) {
        /* 1) return service.getOrThrow(id) */
        return null;
    }

    @PostMapping("/api/admin/encyclopedias")
    @ResponseBody
    public PartyEncyclopedia apiCreate(@RequestBody PartyEncyclopedia item) {
        /* 1) return service.create(item) */
        return null;
    }

    @PutMapping("/api/admin/encyclopedias/{id}")
    @ResponseBody
    public PartyEncyclopedia apiUpdate(@PathVariable Integer id, @RequestBody PartyEncyclopedia item) {
        /* 1) return service.update(id, item) */
        return null;
    }

    @DeleteMapping("/api/admin/encyclopedias/{id}")
    @ResponseBody
    public void apiDelete(@PathVariable Integer id) {
        /* 1) service.delete(id) */
    }
}