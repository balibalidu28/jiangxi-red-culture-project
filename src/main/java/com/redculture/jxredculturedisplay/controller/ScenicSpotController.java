package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.RedScenicSpot;
import com.redculture.jxredculturedisplay.service.RedScenicSpotService;
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
@RequestMapping("/scenicspots") // 用户功能路径，完全独立，无管理路径
@CrossOrigin(origins = "http://localhost:63342")
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
    // ============ 新增：后台管理API ============
    @PostMapping("/api")
    @ResponseBody
    public RedScenicSpot apiCreate(@RequestBody RedScenicSpot scenicSpot) {
        return service.create(scenicSpot);
    }

    @PutMapping("/api/{id}")
    @ResponseBody
    public RedScenicSpot apiUpdate(@PathVariable Integer id, @RequestBody RedScenicSpot scenicSpot) {
        return service.update(id, scenicSpot);
    }

    @DeleteMapping("/api/{id}")
    @ResponseBody
    public void apiDelete(@PathVariable Integer id) {
        service.delete(id);
    }

    // ============ 新增：图片上传API ============
    @PostMapping("/api/{id}/upload-image")
    @ResponseBody
    public Map<String, Object> uploadScenicImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        if (file.isEmpty()) throw new IllegalArgumentException("文件为空");

        // 保存到 src/main/resources/static/images/scenic/
        String dirPath = System.getProperty("user.dir") + "/src/main/resources/static/images/scenic/";
        Files.createDirectories(Path.of(dirPath));

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        Path savePath = Path.of(dirPath, filename);
        file.transferTo(savePath.toFile());

        // 供前端访问的路径
        String url = "/images/scenic/" + filename;

        // 更新数据库
        RedScenicSpot spot = service.getOrThrow(id);
        spot.setImageUrl(url);
        service.save(spot);

        Map<String, Object> resp = new HashMap<>();
        resp.put("url", url);
        return resp;
    }
}