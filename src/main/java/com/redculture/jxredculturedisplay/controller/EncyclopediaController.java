package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import com.redculture.jxredculturedisplay.service.PartyEncyclopediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
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
            var item = service.getOrThrow(id);
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
            PartyEncyclopedia encyclopedia = service.getOrThrow(Long.valueOf(id));
            return ResponseEntity.ok(encyclopedia);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // 返回 404
        }
    }
}