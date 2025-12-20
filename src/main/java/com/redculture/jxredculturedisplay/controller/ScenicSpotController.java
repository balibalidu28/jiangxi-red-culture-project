package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedScenicSpot;
import com.redculture.jxredculturedisplay.service.RedScenicSpotService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/scenicspots") // 用户功能路径，完全独立，无管理路径
public class ScenicSpotController {

    private final RedScenicSpotService service;

    public ScenicSpotController(RedScenicSpotService service) {
        this.service = service;
    }

    @GetMapping
    public String pageList(@RequestParam(required = false) String location, Model model) {
        List<RedScenicSpot> list = service.list(location);
        model.addAttribute("spots", list);
        model.addAttribute("currentLoc", location);
        return "scenic/list";
    }

    @GetMapping("/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        RedScenicSpot spot = service.getOrThrow(id);
        model.addAttribute("spot", spot);
        return "scenic/detail";
    }

    @GetMapping("/api")
    @ResponseBody
    public List<RedScenicSpot> apiList(@RequestParam(required = false) String location) {
        return service.list(location);
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public RedScenicSpot apiDetail(@PathVariable Integer id) {
        return service.getOrThrow(id);
    }
}