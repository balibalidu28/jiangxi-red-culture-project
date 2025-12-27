package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import com.redculture.jxredculturedisplay.service.PartyEncyclopediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Controller
@CrossOrigin(origins = "http://localhost:63342")
public class EncyclopediaController {

    @Autowired
    private PartyEncyclopediaService service;

    @GetMapping("/encyclopedia/list")
    public String listPage(
            @RequestParam(value = "kw", required = false) String keyword,
            @RequestParam(value = "id", required = false) Long id,
            Model model
    ) {
        // 1. 查询数据
        var list = service.search(keyword);

        // 【调试打印】请在IDEA控制台看这一行！！！
        System.out.println("========== 正在查询 ==========");
        System.out.println("搜索词: " + keyword);
        System.out.println("查到条数: " + list.size());

        model.addAttribute("entryList", list);
        model.addAttribute("currentKw", keyword);

        // 2. 判断模式
        if (id != null) {
            var item = service.getOrThrow(Math.toIntExact(id));
            model.addAttribute("item", item);
            model.addAttribute("mode", "detail");
        } else if (keyword != null && !keyword.isEmpty()) {
            model.addAttribute("mode", "search_result");
        } else {
            model.addAttribute("mode", "home");
        }

        return "encyclopedia/list";
    }
    // 添加这个 GET 方法！！！
    @GetMapping("/encyclopedias/{id}")
    public ResponseEntity<PartyEncyclopedia> getEncyclopediaById(@PathVariable Integer id) {
        try {
            PartyEncyclopedia encyclopedia = service.getOrThrow(id);
            return ResponseEntity.ok(encyclopedia);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // 返回 404
        }
    }
    @PostMapping("/encyclopedias/api/{id}/upload-image")
    @ResponseBody
    public ResponseEntity<?> uploadEncyclopediaImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("======= 百科图片上传开始 =======");
            System.out.println("百科ID: " + id);
            System.out.println("文件名: " + file.getOriginalFilename());
            System.out.println("文件大小: " + file.getSize() + " bytes");

            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "文件为空");
                return ResponseEntity.badRequest().body(response);
            }

            // 创建保存目录
            String projectDir = System.getProperty("user.dir");
            String uploadDir = projectDir + "/src/main/resources/static/images/encyclopedia/";
            java.nio.file.Path uploadPath = java.nio.file.Path.of(uploadDir);

            // 如果目录不存在，创建它
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
                System.out.println("创建目录: " + uploadPath.toAbsolutePath());
            }

            // 生成唯一文件名（保留原扩展名）
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(dotIndex);
            }

            // 使用UUID生成唯一文件名
            String uniqueFileName = java.util.UUID.randomUUID().toString() + fileExtension;
            java.nio.file.Path filePath = uploadPath.resolve(uniqueFileName);

            // 保存文件
            file.transferTo(filePath.toFile());
            System.out.println("文件保存到: " + filePath.toAbsolutePath());

            // 构建访问URL（相对路径）
            String imageUrl = "/images/encyclopedia/" + uniqueFileName;
            System.out.println("图片访问URL: " + imageUrl);

            // 更新数据库中的图片URL
            PartyEncyclopedia encyclopedia = service.getOrThrow(id);
            encyclopedia.setImageUrl(imageUrl);
            service.save(encyclopedia);
            System.out.println("数据库已更新图片URL");

            // 返回成功响应
            response.put("success", true);
            response.put("url", imageUrl);
            response.put("filename", uniqueFileName);
            response.put("message", "上传成功");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("上传图片失败: " + e.getMessage());

            response.put("success", false);
            response.put("message", "上传失败: " + e.getMessage());
            response.put("error", e.getClass().getName());

            return ResponseEntity.status(500).body(response);
        }
    }

    // 添加PATCH接口用于单独更新图片URL
    @PatchMapping("/encyclopedias/api/{id}")
    @ResponseBody
    public ResponseEntity<?> updateImageUrl(
            @PathVariable Integer id,
            @RequestBody Map<String, String> updates
    ) {
        try {
            PartyEncyclopedia encyclopedia = service.getOrThrow(id);
            if (updates.containsKey("imageUrl")) {
                encyclopedia.setImageUrl(updates.get("imageUrl"));
                service.save(encyclopedia);
            }
            return ResponseEntity.ok(encyclopedia);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}