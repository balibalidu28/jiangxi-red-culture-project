package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedStory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class StoryController {
    // TODO: 注入 RedStoryService

    @GetMapping("/stories")
    public String pageList(@RequestParam(defaultValue = "0") int page,
                           @RequestParam(defaultValue = "10") int size,
                           @RequestParam(required = false) String kw,
                           Model model) {
        return "story/list";
    }

    @GetMapping("/stories/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        return "story/detail";
    }

    @GetMapping("/api/stories")
    @ResponseBody
    public Page<RedStory> apiPage(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size,
                                  @RequestParam(required = false) String kw) {
        return null;
    }

    @GetMapping("/api/stories/{id}")
    @ResponseBody
    public RedStory apiDetail(@PathVariable Integer id) {
        return null;
    }

    @PostMapping("/api/admin/stories")
    @ResponseBody
    public RedStory apiCreate(@RequestBody RedStory story) {
        return null;
    }

    @PutMapping("/api/admin/stories/{id}")
    @ResponseBody
    public RedStory apiUpdate(@PathVariable Integer id, @RequestBody RedStory story) {
        return null;
    }

    @DeleteMapping("/api/admin/stories/{id}")
    @ResponseBody
    public void apiDelete(@PathVariable Integer id) { }
}