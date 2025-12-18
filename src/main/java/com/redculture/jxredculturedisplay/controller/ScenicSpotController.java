package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedScenicSpot;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ScenicSpotController {
    // TODO: 注入 RedScenicSpotService

    @GetMapping("/scenicspots")
    public String pageList(@RequestParam(required = false) String location, Model model) {
        /*
         * 1) list = service.list(location)
         * 2) model.addAttribute("list", list)
         * 3) model.addAttribute("location", location)
         * 4) return "scenic/list"
         */
        return "scenic/list";
    }

    @GetMapping("/scenicspots/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        /*
         * 1) spot = service.getOrThrow(id)
         * 2) model.addAttribute("spot", spot)
         * 3) return "scenic/detail"
         */
        return "scenic/detail";
    }

    @GetMapping("/api/scenicspots")
    @ResponseBody
    public List<RedScenicSpot> apiList(@RequestParam(required = false) String location) {
        /* 1) return service.list(location) */
        return null;
    }

    @GetMapping("/api/scenicspots/{id}")
    @ResponseBody
    public RedScenicSpot apiDetail(@PathVariable Integer id) {
        /* 1) return service.getOrThrow(id) */
        return null;
    }

    @PostMapping("/api/admin/scenicspots")
    @ResponseBody
    public RedScenicSpot apiCreate(@RequestBody RedScenicSpot spot) {
        /* 1) return service.create(spot) */
        return null;
    }

    @PutMapping("/api/admin/scenicspots/{id}")
    @ResponseBody
    public RedScenicSpot apiUpdate(@PathVariable Integer id, @RequestBody RedScenicSpot spot) {
        /* 1) return service.update(id, spot) */
        return null;
    }

    @DeleteMapping("/api/admin/scenicspots/{id}")
    @ResponseBody
    public void apiDelete(@PathVariable Integer id) {
        /* 1) service.delete(id) */
    }
}