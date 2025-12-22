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

    public PartyEncyclopedia getOrThrow(Long id) {
        return repository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("未找到该词条"));
    }

    // Admin用的
    public List<PartyEncyclopedia> listAll() { return repository.findAll(); }
    public PartyEncyclopedia save(PartyEncyclopedia e) { return repository.save(e); }
    public PartyEncyclopedia update(Long id, PartyEncyclopedia e) { return repository.save(e); } // 简化写
    public void deleteById(Integer id) { repository.deleteById(id); }
}