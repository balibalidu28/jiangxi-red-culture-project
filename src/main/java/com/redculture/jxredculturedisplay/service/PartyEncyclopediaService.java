package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import com.redculture.jxredculturedisplay.repository.PartyEncyclopediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PartyEncyclopediaService {

    @Autowired
    private PartyEncyclopediaRepository repository;

    /**
     * 修复：搜索逻辑 - 同时搜索标题和内容，并去重
     */
    public List<PartyEncyclopedia> search(String keyword) {
        System.out.println("=== Service 搜索调用 ===");
        System.out.println("搜索关键词: " + keyword);

        // 1. 如果有搜索词，使用Repository的searchByKeyword方法（同时搜索标题和内容）
        if (keyword != null && !keyword.trim().isEmpty()) {
            List<PartyEncyclopedia> results = repository.searchByKeyword(keyword.trim());
            System.out.println("搜索结果数量: " + results.size());

            // 去重处理（按ID去重）
            return results.stream()
                    .distinct() // 去重
                    .collect(Collectors.toList());
        }
        // 2. 如果没有搜索词，返回所有数据并按ID排序
        else {
            List<PartyEncyclopedia> allEntries = repository.findAllByOrderByIdAsc();
            System.out.println("返回所有词条数量: " + allEntries.size());
            return allEntries;
        }
    }

    /**
     * 判断词条是否在列表中
     */
    public boolean isInList(Long id, List<PartyEncyclopedia> list) {
        if (id == null || list == null || list.isEmpty()) {
            return false;
        }
        return list.stream().anyMatch(item -> item.getId().equals(id.intValue()));
    }


    public PartyEncyclopedia getOrThrow(Long id) {
        return repository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("未找到该词条"));
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