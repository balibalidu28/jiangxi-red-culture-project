package com.redculture.jxredculturedisplay.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {
    // TODO: 注入各模块Service用于统计

    @GetMapping("/admin")
    public String dashboard(Model model) {
        return "admin/dashboard";
    }

    @GetMapping("/admin/login")
    public String loginPage() {
        return "admin/login";
    }
}