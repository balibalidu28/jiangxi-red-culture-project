package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.common.ApiResponse;
import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import com.redculture.jxredculturedisplay.service.PartyEncyclopediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@CrossOrigin(origins = "https://localhost:63343")
@RequestMapping("/encyclopedia")
public class EncyclopediaController {

    @Autowired
    private PartyEncyclopediaService partyEncyclopediaService;

    /**
     * 党史大百科主页面 - 彻底修复版本
     */
    @GetMapping("/list")
    public String listPage(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "kw", required = false) String keyword,
            Model model) {

        System.out.println("\n=== 党史大百科页面请求 ===");
        System.out.println("请求参数: id=" + id + ", kw=" + keyword);

        String mode = "home";
        List<PartyEncyclopedia> entryList;
        PartyEncyclopedia currentItem = null;
        String currentKw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        // 情况1：有搜索关键词
        if (currentKw != null) {
            System.out.println("🔍 搜索模式，关键词: " + currentKw);

            // 获取搜索结果
            entryList = partyEncyclopediaService.search(currentKw);
            System.out.println("搜索结果条数: " + entryList.size());

            // 情况1.1：点击了搜索结果（有id参数）
            if (id != null) {
                try {
                    currentItem = partyEncyclopediaService.findById(id);
                    System.out.println("✅ 找到详情词条: " + currentItem.getTitle());

                    // 关键修复：确保当前词条在列表中（去重逻辑）
                    boolean foundInResults = false;
                    List<PartyEncyclopedia> uniqueList = new ArrayList<>();

                    for (PartyEncyclopedia entry : entryList) {
                        // 去重逻辑：如果还没有添加过这个词条
                        if (!uniqueList.stream().anyMatch(e -> e.getId().equals(entry.getId()))) {
                            uniqueList.add(entry);
                        }
                        // 检查是否是当前词条
                        if (entry.getId().equals(currentItem.getId())) {
                            foundInResults = true;
                        }
                    }

                    entryList = uniqueList; // 使用去重后的列表

                    // 如果当前词条不在搜索结果中，添加到列表开头
                    if (!foundInResults) {
                        System.out.println("⚠️ 当前词条不在搜索结果中，添加到列表开头");
                        entryList.add(0, currentItem);
                    }

                    mode = "detail";
                    System.out.println("📄 模式：搜索+详情");

                } catch (RuntimeException e) {
                    System.out.println("❌ 未找到词条，ID: " + id);
                    mode = "search_result";
                }
            }
            // 情况1.2：只有搜索关键词，没有点击详情
            else {
                System.out.println("📋 模式：纯搜索");
                mode = "search_result";
            }
        }
        // 情况2：没有搜索关键词，但有id（直接访问词条）
        else if (id != null) {
            try {
                currentItem = partyEncyclopediaService.findById(id);
                mode = "detail";
                System.out.println("📄 直接访问词条: " + currentItem.getTitle());
                // 显示所有词条在左侧
                entryList = partyEncyclopediaService.search(null);
            } catch (RuntimeException e) {
                System.out.println("❌ 未找到词条，ID: " + id);
                entryList = partyEncyclopediaService.search(null);
                mode = "home";
            }
        }
        // 情况3：既没有搜索关键词也没有id（首页）
        else {
            entryList = partyEncyclopediaService.search(null);
            mode = "home";
            System.out.println("🏠 首页模式");
        }

        System.out.println("📊 最终数据：");
        System.out.println("- 模式: " + mode);
        System.out.println("- 当前关键词: " + currentKw);
        System.out.println("- 当前词条: " + (currentItem != null ? currentItem.getTitle() : "无"));
        System.out.println("- 列表大小: " + entryList.size());
        System.out.println("=== 请求处理完成 ===\n");

        // 将数据传递给前端模板
        model.addAttribute("entryList", entryList);
        model.addAttribute("item", currentItem);
        model.addAttribute("currentKw", currentKw);
        model.addAttribute("mode", mode);

        return "encyclopedia/list";
    }
    // ============== API接口 ==============

    /**
     * API接口：获取所有词条
     */
    @GetMapping("/api/entries")
    @ResponseBody
    public ApiResponse<List<PartyEncyclopedia>> getAllEntries() {
        System.out.println("=== API调用：获取所有词条 ===");
        try {
            List<PartyEncyclopedia> entries = partyEncyclopediaService.search(null);
            System.out.println("API返回数据条数: " + entries.size());
            return ApiResponse.success("获取成功", entries);
        } catch (Exception e) {
            System.out.println("API获取失败: " + e.getMessage());
            return ApiResponse.error("获取失败: " + e.getMessage());
        }
    }

    /**
     * API接口：搜索词条
     */
    @GetMapping("/api/search")
    @ResponseBody
    public ApiResponse<List<PartyEncyclopedia>> searchEntries(
            @RequestParam(value = "keyword", required = false) String keyword) {
        System.out.println("=== API调用：搜索词条 ===");
        System.out.println("搜索关键词: " + keyword);
        try {
            List<PartyEncyclopedia> results = partyEncyclopediaService.search(keyword);
            System.out.println("API搜索结果条数: " + results.size());
            return ApiResponse.success("搜索成功", results);
        } catch (Exception e) {
            System.out.println("API搜索失败: " + e.getMessage());
            return ApiResponse.error("搜索失败: " + e.getMessage());
        }
    }

    /**
     * API接口：获取词条详情
     */
    @GetMapping("/api/entry/{id}")
    @ResponseBody
    public ApiResponse<PartyEncyclopedia> getEntryApi(@PathVariable Long id) {
        System.out.println("=== API调用：获取词条详情 ===");
        System.out.println("词条ID: " + id);
        try {
            PartyEncyclopedia entry = partyEncyclopediaService.findById(id);
            return ApiResponse.success("获取成功", entry);
        } catch (RuntimeException e) {
            return ApiResponse.notFound(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("获取失败: " + e.getMessage());
        }
    }

    // 添加这个 GET 方法！！！=
    @GetMapping("/{id}")
    public ResponseEntity<PartyEncyclopedia> getEncyclopediaById(@PathVariable Long id) {
        try {
            PartyEncyclopedia encyclopedia = partyEncyclopediaService.getOrThrow(Long.valueOf(id));
            return ResponseEntity.ok(encyclopedia);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // 返回 404
        }
    }
    @PostMapping("/api/{id}/upload-image")
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
            PartyEncyclopedia encyclopedia = partyEncyclopediaService.getOrThrow(Long.valueOf(id));
            encyclopedia.setImageUrl(imageUrl);
            partyEncyclopediaService.save(encyclopedia);
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
    @PatchMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<?> updateImageUrl(
            @PathVariable Integer id,
            @RequestBody Map<String, String> updates
    ) {
        try {
            PartyEncyclopedia encyclopedia = partyEncyclopediaService.getOrThrow(Long.valueOf(id));
            if (updates.containsKey("imageUrl")) {
                encyclopedia.setImageUrl(updates.get("imageUrl"));
                partyEncyclopediaService.save(encyclopedia);
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
