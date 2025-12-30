package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedStory;
import com.redculture.jxredculturedisplay.service.RedStoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

        // 获取精选故事（最新的3个）
        List<RedStory> featuredStories = redStoryService.listTop(3);

        model.addAttribute("stories", storyPage.getContent());
        model.addAttribute("totalPages", storyPage.getTotalPages());
        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", size);
        model.addAttribute("keyword", kw);
        model.addAttribute("searchKeyword", kw);  // 别名，用于模板
        model.addAttribute("totalItems", storyPage.getTotalElements());
        model.addAttribute("featuredStories", featuredStories);

        // 预先计算分页值
        model.addAttribute("prevPage", Math.max(0, page - 1));
        model.addAttribute("nextPage", Math.min(storyPage.getTotalPages() - 1, page + 1));
        model.addAttribute("lastPage", Math.max(0, storyPage.getTotalPages() - 1));

        return "story/list";
    }

    @GetMapping("/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        RedStory story = redStoryService.getOrThrow(id);
        model.addAttribute("story", story);

        // 获取相关故事（最新的4个，排除当前故事）
        List<RedStory> relatedStories = redStoryService.listTop(5); // 多取一个
        relatedStories.removeIf(s -> s.getId().equals(id));
        if (relatedStories.size() > 4) {
            relatedStories = relatedStories.subList(0, 4);
        }
        model.addAttribute("relatedStories", relatedStories);

        return "story/detail";
    }

    // ============ 前台API ============
    @GetMapping("/api")
    @ResponseBody
    public Page<RedStory> apiPage(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size,
                                  @RequestParam(required = false) String kw) {
        Page<RedStory> pageResult = redStoryService.page(page, size, kw);

        // 处理图片URL，确保是完整可访问的路径
        pageResult.getContent().forEach(story -> {
            if (story.getImageUrl() != null && !story.getImageUrl().startsWith("http")) {
                story.setImageUrl("http://localhost:8080" +
                        (story.getImageUrl().startsWith("/") ? "" : "/") +
                        story.getImageUrl());
            }
        });

        return pageResult;
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public RedStory apiDetail(@PathVariable Integer id) {
        RedStory story = redStoryService.getOrThrow(id);

        // 处理图片URL，确保是完整可访问的路径
        if (story.getImageUrl() != null && !story.getImageUrl().startsWith("http")) {
            String baseUrl = "http://localhost:8080";
            String imageUrl = story.getImageUrl();

            // 确保URL以/开头
            if (!imageUrl.startsWith("/")) {
                imageUrl = "/" + imageUrl;
            }

            // 检查是否是uploaded-files目录的图片
            if (imageUrl.contains("uploaded-files")) {
                // 直接使用绝对路径
                story.setImageUrl(baseUrl + imageUrl);
            } else {
                // 其他情况也使用绝对路径
                story.setImageUrl(baseUrl + imageUrl);
            }
        }

        return story;
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

        // 使用相对路径，确保在静态资源目录下
        String uploadDir = "src/main/resources/static/images/stories/";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 生成唯一文件名
        String filename = UUID.randomUUID() + "_" +
                file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");

        // 保存文件
        File dest = new File(dir, filename);
        file.transferTo(dest);

        // 保存到数据库的路径（相对于静态资源根目录）
        String imageUrl = "/images/stories/" + filename;

        // 更新数据库
        RedStory story = redStoryService.getOrThrow(id);
        story.setImageUrl(imageUrl);
        story.setImageUrl(imageUrl);
        redStoryService.save(story);

        // 同时复制到target目录，以便在开发中立即生效
        File targetDir = new File("target/classes/static/images/stories/");
        targetDir.mkdirs();
        Files.copy(dest.toPath(), new File(targetDir, filename).toPath());

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("imageUrl", imageUrl);  // 确保返回这个字段
        resp.put("filename", filename);

        return resp;
    }
}