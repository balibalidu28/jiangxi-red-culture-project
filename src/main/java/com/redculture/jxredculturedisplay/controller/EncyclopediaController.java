package com.redculture.jxredculturedisplay.controller;

import com.redculture.jxredculturedisplay.service.PartyEncyclopediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class EncyclopediaController {

    @Autowired
    private PartyEncyclopediaService service;

    /**
     * 【改动1】搜索/检索页
     * 旧逻辑：展示列表
     * 新逻辑：这就是一个搜索结果页
     * URL: /encyclopedia/search?kw=xxx
     */
    @GetMapping("/encyclopedia/search") // URL变了
    public String searchPage(
            @RequestParam(value = "kw", required = false) String keyword,
            Model model
    ) {
        // 业务逻辑不变：还是去搜
        var list = service.search(keyword);

        model.addAttribute("entries", list);
        model.addAttribute("currentKw", keyword);

        // 【关键】返回新的文件名 search.html
        return "search/search";
    }

    /**
     * 【改动2】百科词条页
     * URL: /encyclopedia/entry?id=1
     */
    @GetMapping("/encyclopedia/entry") // URL变了
    public String entryPage(@RequestParam("id") Long id, Model model) {
        // 业务逻辑不变：查单个
        var item = service.getOrThrow(id);

        model.addAttribute("item", item);

        // 【关键】返回新的文件名 entry.html
        return "encyclopedia/entry";
    }
}