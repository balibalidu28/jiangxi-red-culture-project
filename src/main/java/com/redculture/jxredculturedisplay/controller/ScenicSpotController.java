package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.common.ApiResponse;
import com.redculture.jxredculturedisplay.model.RedScenicSpot;
import com.redculture.jxredculturedisplay.service.RedScenicSpotService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Controller
@RequestMapping("/scenicspots")
@CrossOrigin(origins = "http://localhost:63342")
public class ScenicSpotController {

    private final RedScenicSpotService service;

    // 构造器注入
    public ScenicSpotController(RedScenicSpotService service) {
        this.service = service;
    }

    @GetMapping
    public String pageList(@RequestParam(required = false) String location, Model model) {
        List<RedScenicSpot> list = service.list(location);
        model.addAttribute("spots", list);
        model.addAttribute("currentLoc", location);
        return "RedScenicSpot/list";
    }

    @GetMapping("/{id}")
    public String pageDetail(@PathVariable Integer id, Model model) {
        RedScenicSpot spot = service.getOrThrow(id);
        model.addAttribute("spot", spot);
        return "RedScenicSpot/detail";
    }

    // ============== API接口 ==============

    @GetMapping("/api")
    @ResponseBody
    public ApiResponse<List<RedScenicSpot>> apiList(@RequestParam(required = false) String location) {
        try {
            List<RedScenicSpot> spots = service.list(location);
            spots = processImageUrls(spots);
            return ApiResponse.success("获取成功", spots);
        } catch (Exception e) {
            return ApiResponse.error("获取失败: " + e.getMessage());
        }
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public ApiResponse<RedScenicSpot> apiDetail(@PathVariable Integer id) {
        try {
            RedScenicSpot spot = service.getOrThrow(id);
            spot = processSingleImageUrl(spot);
            return ApiResponse.success("获取成功", spot);
        } catch (RuntimeException e) {
            return ApiResponse.notFound(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("获取失败: " + e.getMessage());
        }
    }

    // ============ 图片URL处理方法 ============

    private RedScenicSpot processSingleImageUrl(RedScenicSpot spot) {
        if (spot.getImageUrl() != null && !spot.getImageUrl().startsWith("http")) {
            String baseUrl = "http://localhost:8080";
            if (spot.getImageUrl().startsWith("/")) {
                spot.setImageUrl(baseUrl + spot.getImageUrl());
            } else {
                spot.setImageUrl(baseUrl + "/" + spot.getImageUrl());
            }
        }
        return spot;
    }

    private List<RedScenicSpot> processImageUrls(List<RedScenicSpot> spots) {
        String baseUrl = "http://localhost:8080";
        List<RedScenicSpot> processedSpots = new ArrayList<>();

        for (RedScenicSpot spot : spots) {
            RedScenicSpot processedSpot = new RedScenicSpot();
            processedSpot.setId(spot.getId());
            processedSpot.setName(spot.getName());
            processedSpot.setDescription(spot.getDescription());
            processedSpot.setLocation(spot.getLocation());

            if (spot.getImageUrl() != null && !spot.getImageUrl().startsWith("http")) {
                if (spot.getImageUrl().startsWith("/")) {
                    processedSpot.setImageUrl(baseUrl + spot.getImageUrl());
                } else {
                    processedSpot.setImageUrl(baseUrl + "/" + spot.getImageUrl());
                }
            } else {
                processedSpot.setImageUrl(spot.getImageUrl());
            }

            processedSpots.add(processedSpot);
        }

        return processedSpots;
    }

    @GetMapping("/api/home")
    @ResponseBody
    public ApiResponse<List<RedScenicSpot>> apiHomeSpots() {
        try {
            List<RedScenicSpot> allSpots = service.list(null);
            allSpots = processImageUrls(allSpots);

            List<RedScenicSpot> homeSpots;
            if (allSpots.size() > 6) {
                homeSpots = allSpots.subList(0, Math.min(6, allSpots.size()));
            } else {
                homeSpots = allSpots;
            }

            return ApiResponse.success("获取首页推荐成功", homeSpots);
        } catch (Exception e) {
            return ApiResponse.error("获取首页推荐失败: " + e.getMessage());
        }
    }

    // ============ 管理API ============
    @PostMapping("/api")
    @ResponseBody
    public ApiResponse<RedScenicSpot> apiCreate(@RequestBody RedScenicSpot scenicSpot) {
        try {
            System.out.println("========== 创建圣地 ==========");
            System.out.println("接收到的数据:");
            System.out.println("  name: " + scenicSpot.getName());
            System.out.println("  location: " + scenicSpot.getLocation());
            System.out.println("  description: " + scenicSpot.getDescription());
            System.out.println("  imageUrl: " + scenicSpot.getImageUrl());

            RedScenicSpot createdSpot = service.create(scenicSpot);

            System.out.println("创建成功，返回数据:");
            System.out.println("  id: " + createdSpot.getId());
            System.out.println("  name: " + createdSpot.getName());
            System.out.println("========== 创建完成 ==========");

            return ApiResponse.success("创建成功", createdSpot);
        } catch (Exception e) {
            System.out.println("创建失败: " + e.getMessage());
            return ApiResponse.error("创建失败: " + e.getMessage());
        }
    }

    @PutMapping("/api/{id}")
    @ResponseBody
    public ApiResponse<RedScenicSpot> apiUpdate(@PathVariable Integer id, @RequestBody RedScenicSpot scenicSpot) {
        try {
            System.out.println("========== 更新圣地 ==========");
            System.out.println("ID: " + id);
            System.out.println("接收到的数据:");
            System.out.println("  name: " + scenicSpot.getName());
            System.out.println("  location: " + scenicSpot.getLocation());
            System.out.println("  description: " + scenicSpot.getDescription());
            System.out.println("  imageUrl: " + scenicSpot.getImageUrl());

            RedScenicSpot updatedSpot = service.update(id, scenicSpot);

            System.out.println("更新成功，返回数据:");
            System.out.println("  id: " + updatedSpot.getId());
            System.out.println("  name: " + updatedSpot.getName());
            System.out.println("  location: " + updatedSpot.getLocation());
            System.out.println("  imageUrl: " + updatedSpot.getImageUrl());
            System.out.println("========== 更新完成 ==========");

            // 处理图片URL
            updatedSpot = processSingleImageUrl(updatedSpot);

            return ApiResponse.success("更新成功", updatedSpot);
        } catch (Exception e) {
            System.out.println("更新失败: " + e.getMessage());
            e.printStackTrace();
            return ApiResponse.error("更新失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/api/{id}")
    @ResponseBody
    public ApiResponse<Void> apiDelete(@PathVariable Integer id) {
        try {
            service.delete(id);
            return ApiResponse.success("删除成功", null);
        } catch (Exception e) {
            return ApiResponse.error("删除失败: " + e.getMessage());
        }
    }

    @PostMapping("/api/{id}/upload-image")
    @ResponseBody
    public Map<String, Object> uploadScenicImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        if (file.isEmpty()) throw new IllegalArgumentException("文件为空");

        String dirPath = System.getProperty("user.dir") + "/src/main/resources/static/images/scenic/";
        Files.createDirectories(Path.of(dirPath));

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        Path savePath = Path.of(dirPath, filename);
        file.transferTo(savePath.toFile());

        String url = "/images/scenic/" + filename;

        RedScenicSpot spot = service.getOrThrow(id);
        spot.setImageUrl(url);
        service.save(spot);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("url", url);
        resp.put("message", "上传成功");
        return resp;
    }
}