package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.*;
import com.redculture.jxredculturedisplay.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.List;
@RestController
@RequestMapping("/api/admin") // 后台管理路径的唯一前缀
public class AdminController {

    private final RedHeroService heroService;
    private final RedStoryService storyService;
    private final RedScenicSpotService scenicSpotService;
    private final RedExploreService exploreService;
    private final PartyEncyclopediaService encyclopediaService;
    private final UserService userService;

    // 通过构造函数注入所有相关服务
    public AdminController(
            RedHeroService heroService,
            RedStoryService storyService,
            RedScenicSpotService scenicSpotService,
            RedExploreService exploreService,
            PartyEncyclopediaService encyclopediaService,
            UserService userService
    ) {
        this.heroService = heroService;
        this.storyService = storyService;
        this.scenicSpotService = scenicSpotService;
        this.exploreService = exploreService;
        this.encyclopediaService = encyclopediaService;
        this.userService = userService;
    }

    // ========================== 英雄管理功能 ==========================

    // 获取所有英雄
    @GetMapping("/heroes")
    public List<RedHero> getAllHeroes() {
        return heroService.listAll();
    }

    // 创建一个英雄
    @PostMapping("/heroes")
    public RedHero createHero(@RequestBody RedHero hero) {
        return heroService.save(hero);
    }

    // 更新英雄
    @PutMapping("/heroes/{id}")
    public RedHero updateHero(@PathVariable Integer id, @RequestBody RedHero heroDetails) {
        return heroService.update(id, heroDetails);
    }

    // 删除英雄
    @DeleteMapping("/heroes/{id}")
    public void deleteHero(@PathVariable Integer id) {
        heroService.deleteById(id);
    }

    // ========================== 活动管理功能 ==========================

    // 获取所有活动
    @GetMapping("/explore")
    public List<RedExplore> getAllExplores() {
        return exploreService.listAll();
    }

    // 创建一个活动
    @PostMapping("/explore")
    public RedExplore createExplore(@RequestBody RedExplore explore) {
        return exploreService.save(explore);
    }

    // 更新活动
    @PutMapping("/explore/{id}")
    public RedExplore updateExplore(@PathVariable Integer id, @RequestBody RedExplore exploreDetails) {
        return exploreService.update(id, exploreDetails);
    }

    // 删除活动
    @DeleteMapping("/explore/{id}")
    public void deleteExplore(@PathVariable Integer id) {
        exploreService.deleteById(id);
    }

    // ========================== 活动文件上传（图片/报名表） ==========================

    // POST /api/admin/explore/{id}/upload-image
    @PostMapping("/explore/{id}/upload-image")
    public Map<String, Object> uploadExploreImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        if (file.isEmpty()) throw new IllegalArgumentException("文件为空");

        // 保存到 src/main/resources/static/images/explore/
        String dirPath = System.getProperty("user.dir") + "/src/main/resources/static/images/explore/";
        Files.createDirectories(Path.of(dirPath));

        String originalFilename = file.getOriginalFilename();
        String ext = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : ".jpg";
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;

        Path savePath = Path.of(dirPath, filename);
        file.transferTo(savePath.toFile());

        // 前端可访问的路径
        String url = "/images/explore/" + filename;

        // 更新数据库 image 字段
        RedExplore explore = exploreService.getOrThrow(id);
        explore.setImage(url);
        exploreService.save(explore);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("url", url);
        return resp;
    }

    // POST /api/admin/explore/{id}/upload-registration-form
    @PostMapping("/explore/{id}/upload-registration-form")
    public Map<String, Object> uploadExploreRegistrationForm(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        if (file.isEmpty()) throw new IllegalArgumentException("文件为空");

        // 保存到 src/main/resources/static/files/explore/
        String dirPath = System.getProperty("user.dir") + "/src/main/resources/static/files/explore/";
        Files.createDirectories(Path.of(dirPath));

        String originalFilename = file.getOriginalFilename();
        String ext = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : "";
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;

        Path savePath = Path.of(dirPath, filename);
        file.transferTo(savePath.toFile());

        // 前端可访问的路径
        String url = "/files/explore/" + filename;

        // 更新数据库 registrationForm 字段
        RedExplore explore = exploreService.getOrThrow(id);
        explore.setRegistrationForm(url);
        exploreService.save(explore);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("url", url);
        return resp;
    }

    // ========================== 故事管理功能 ==========================

    // 获取所有故事
    @GetMapping("/stories")
    public List<RedStory> getAllStories() {
        return storyService.listAll();
    }

    // 添加故事
    @PostMapping("/stories")
    public RedStory createStory(@RequestBody RedStory story) {
        return storyService.save(story);
    }

    // 修改故事
    @PutMapping("/stories/{id}")
    public RedStory updateStory(@PathVariable Integer id, @RequestBody RedStory storyDetails) {
        return storyService.update(id, storyDetails);
    }

    // 删除故事
    @DeleteMapping("/stories/{id}")
    public void deleteStory(@PathVariable Integer id) {
        storyService.deleteById(id);
    }

    // ========================== 红色圣地管理功能 ==========================

    // 获取所有圣地
    @GetMapping("/scenicspots")
    public List<RedScenicSpot> getAllScenicSpots() {
        return scenicSpotService.listAll();
    }

    // 创建圣地
    @PostMapping("/scenicspots")
    public RedScenicSpot createScenicSpot(@RequestBody RedScenicSpot scenicSpot) {
        System.out.println("接收到的数据: " + scenicSpot.toString());
        return scenicSpotService.create(scenicSpot);
    }

    // 更新圣地信息
    @PutMapping("/scenicspots/{id}")
    public RedScenicSpot updateScenicSpot(@PathVariable Integer id, @RequestBody RedScenicSpot scenicSpotDetails) {
        return scenicSpotService.update(id, scenicSpotDetails);
    }

    // 删除圣地
    @DeleteMapping("/scenicspots/{id}")
    public void deleteScenicSpot(@PathVariable Integer id) {
        scenicSpotService.delete(id);
    }

    // ========================== 百科管理功能 ==========================

    // 获取所有百科条目
    @GetMapping("/encyclopedias")
    public List<PartyEncyclopedia> getAllEncyclopedias() {
        return encyclopediaService.listAll();
    }

    // 创建百科条目
    @PostMapping("/encyclopedias")
    public PartyEncyclopedia createEncyclopedia(@RequestBody PartyEncyclopedia encyclopedia) {
        return encyclopediaService.save(encyclopedia);
    }

    // 更新百科条目
    @PutMapping("/encyclopedias/{id}")
    public PartyEncyclopedia updateEncyclopedia(@PathVariable Integer id, @RequestBody PartyEncyclopedia encyclopediaDetails) {
        return encyclopediaService.update(Long.valueOf(id), encyclopediaDetails);
    }

    // 删除百科条目
    @DeleteMapping("/encyclopedias/{id}")
    public void deleteEncyclopedia(@PathVariable Integer id) {
        encyclopediaService.deleteById((id));
    }
    public ResponseEntity<PartyEncyclopedia> getEncyclopediaById(@PathVariable Integer id) {
        PartyEncyclopedia encyclopedia = encyclopediaService.findById(Long.valueOf(id));

        if (encyclopedia == null) {
            return ResponseEntity.notFound().build(); // 返回 404
        }

        return ResponseEntity.ok(encyclopedia); // 返回 200 和百科数据
    }
    // ========================== 用户管理功能（新增） ==========================

    // 获取所有用户
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.listAll();
    }

    // 按ID获取用户
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    // 创建用户
    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }

    // 更新用户
    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Integer id, @RequestBody User userDetails) {
        return userService.update(id, userDetails);
    }

    // 删除用户
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteById(id);
    }

    // 可选：锁定/解锁用户（需要在 service 层实现）
    // @PatchMapping("/users/{id}/status")
    // public User changeUserStatus(@PathVariable Integer id, @RequestParam("enabled") boolean enabled) {
    //     return userService.changeStatus(id, enabled);
    // }

    // 可选：重置密码（需要在 service 层实现）
    // @PostMapping("/users/{id}/reset-password")
    // public void resetPassword(@PathVariable Integer id, @RequestBody ResetPasswordRequest req) {
    //     userService.resetPassword(id, req.getNewPassword());
    // }

    // 可选：更新用户角色（需要在 service 层实现）
    // @PutMapping("/users/{id}/roles")
    // public User updateUserRoles(@PathVariable Integer id, @RequestBody List<String> roles) {
    //     return userService.updateRoles(id, roles);
    // }
}