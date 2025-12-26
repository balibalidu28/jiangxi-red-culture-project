package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedStory;
import com.redculture.jxredculturedisplay.service.RedStoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("/stories")
@CrossOrigin(origins = "http://localhost:63342")  // 添加CORS支持
public class StoryController {

    @Autowired
    private RedStoryService redStoryService;

    // ============ 前台页面API ============
    @GetMapping
    public String pageList(@RequestParam(defaultValue = "0") int page,
                           @RequestParam(defaultValue = "10") int size,
                           @RequestParam(required = false) String kw,
                           Model model) {
        Page<RedStory> storyPage = redStoryService.page(page, size, kw);
        model.addAttribute("stories", storyPage.getContent());
        model.addAttribute("totalPages", storyPage.getTotalPages());
        model.addAttribute("currentPage", page);
        model.addAttribute("keyword", kw);
        return "story/list";
    }

    @GetMapping("/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        RedStory story = redStoryService.getOrThrow(id);
        model.addAttribute("story", story);
        return "story/detail";
    }

    // ============ 前台API ============
    @GetMapping("/api")
    @ResponseBody
    public Page<RedStory> apiPage(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size,
                                  @RequestParam(required = false) String kw) {
        return redStoryService.page(page, size, kw);
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public RedStory apiDetail(@PathVariable Integer id) {
        return redStoryService.getOrThrow(id);
    }

    // ============ 后台管理API（前端调用的是 /api/admin/stories）============
    @GetMapping("/api/admin")
    @ResponseBody
    public List<RedStory> apiAdminList() {
        return redStoryService.listAll();
    }

    @GetMapping("/api/admin/{id}")
    @ResponseBody
    public RedStory apiAdminDetail(@PathVariable Integer id) {
        return redStoryService.getOrThrow(id);
    }

    @PostMapping("/api/admin")
    @ResponseBody
    public RedStory apiCreate(@RequestBody RedStory story) {
        return redStoryService.create(story);
    }

    @PutMapping("/api/admin/{id}")
    @ResponseBody
    public RedStory apiUpdate(@PathVariable Integer id, @RequestBody RedStory story) {
        return redStoryService.update(id, story);
    }

    @DeleteMapping("/api/admin/{id}")
    @ResponseBody
    public void apiDelete(@PathVariable Integer id) {
        redStoryService.delete(id);
    }

    // ============ 图片上传API ============
    @PostMapping("/api/admin/{id}/upload-image")
    @ResponseBody
    public Map<String, Object> uploadStoryImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        if (file.isEmpty()) throw new IllegalArgumentException("文件为空");

        // 保存到 src/main/resources/static/images/story/
        String dirPath = System.getProperty("user.dir") + "/src/main/resources/static/images/stories/";
        Files.createDirectories(Path.of(dirPath));

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        Path savePath = Path.of(dirPath, filename);
        file.transferTo(savePath.toFile());

        // 供前端访问的路径
        String url = "/images/stories/" + filename;

        // 更新数据库
        RedStory story = redStoryService.getOrThrow(id);
        story.setImageUrl(url);
        redStoryService.save(story);

        Map<String, Object> resp = new HashMap<>();
        resp.put("url", url);
        return resp;
    }
}