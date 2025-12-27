package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import com.redculture.jxredculturedisplay.repository.PartyEncyclopediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartyEncyclopediaService {

    @Autowired
    private PartyEncyclopediaRepository repository;

    /**
     * 核心搜索逻辑
     */
    public List<PartyEncyclopedia> search(String keyword) {
        // 1. 如果有搜索词，就模糊查询
        if (keyword != null && !keyword.trim().isEmpty()) {
            return repository.findByTitleContaining(keyword);
        }
        // 2. 关键：如果没词（比如刚点进来），一定要返回所有数据！
        else {
            return repository.findAll();
        }
    }

    public PartyEncyclopedia getOrThrow(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("未找到该词条，ID: " + id));
    }

    // Admin用的
    public List<PartyEncyclopedia> listAll() { return repository.findAll(); }
    public PartyEncyclopedia save(PartyEncyclopedia e) { return repository.save(e); }
    public PartyEncyclopedia update(Long id, PartyEncyclopedia encyclopediaDetails) {
        System.out.println("Service更新百科，ID: " + id);

        // 1. 找到现有记录
        PartyEncyclopedia existing = findById(id);
        if (existing == null) {
            throw new RuntimeException("百科条目不存在，ID: " + id);
        }

        // 2. 更新字段
        existing.setTitle(encyclopediaDetails.getTitle());
        existing.setContent(encyclopediaDetails.getContent());

        // 3. 只更新有值的图片URL（避免清空已有图片）
        if (encyclopediaDetails.getImageUrl() != null && !encyclopediaDetails.getImageUrl().isEmpty()) {
            existing.setImageUrl(encyclopediaDetails.getImageUrl());
        }

        System.out.println("更新后的数据: " + existing);

        // 4. 保存（这会执行UPDATE而不是INSERT）
        return repository.save(existing);
    }    public void deleteById(Integer id) { repository.deleteById(id); }

    public PartyEncyclopedia findById(Long id) {
        // 使用 JPA 的 findById 方法
        return repository.findById(Math.toIntExact(Long.valueOf(id)))
                .orElseThrow(() -> new RuntimeException("百科条目不存在，ID: " + id));
    }
}