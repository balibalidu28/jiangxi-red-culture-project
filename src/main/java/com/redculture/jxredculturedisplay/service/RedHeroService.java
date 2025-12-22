package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedHero;
import com.redculture.jxredculturedisplay.repository.RedHeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
public class RedHeroService {

    @Autowired
    private RedHeroRepository redHeroRepository;

    public long count() {
        /* 1) repo.count() 2) return */
        return redHeroRepository.count();
    }

    public List<RedHero> listTop(int n) {
        /* 1) PageRequest.of(0,n) 2) repo.findAll(pageable).getContent() 3) return */
        Pageable pageable = PageRequest.of(0, n);
        Page<RedHero> page = redHeroRepository.findAll(pageable);
        return page.getContent();
    }

    public List<RedHero> listAll() {
        /* 1) repo.findAll() 2) return */
        return redHeroRepository.findAll();
    }

    public RedHero getOrThrow(Integer id) {
        /* 1) repo.findById 2) 不存在抛异常 3) return */
        Optional<RedHero> optional = redHeroRepository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("英雄不存在，id: " + id);
        }
        return optional.get();
    }

    public RedHero create(RedHero hero) {
        /* 1) 校验name必填 2) id置空 3) repo.save 4) return */
        if (!StringUtils.hasText(hero.getName())) {
            throw new IllegalArgumentException("英雄姓名不能为空");
        }
        hero.setId(null); // 确保id为null，让数据库自增
        return redHeroRepository.save(hero);
    }

    public RedHero update(Integer id, RedHero hero) {
        /* 1) db=getOrThrow 2) 更新字段 3) repo.save 4) return */
        RedHero dbHero = getOrThrow(id);

        // 更新可修改的字段
        if (StringUtils.hasText(hero.getName())) {
            dbHero.setName(hero.getName());
        }
        if (hero.getDescription() != null) {
            dbHero.setDescription(hero.getDescription());
        }
        if (hero.getImageUrl() != null) {
            dbHero.setImageUrl(hero.getImageUrl());
        }

        return redHeroRepository.save(dbHero);
    }

    public void delete(Integer id) {
        /* 1) repo.deleteById(id)（可选先getOrThrow） */
        // 先检查是否存在
        getOrThrow(id);
        redHeroRepository.deleteById(id);
    }

    // 以下是新增的方法，用于支持前端页面功能

    // 模糊搜索英雄
    public List<RedHero> searchByName(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return redHeroRepository.findAll();
        }
        return redHeroRepository.findByNameContainingIgnoreCase(keyword);
    }

    // 分页搜索英雄
    public Page<RedHero> searchByName(String keyword, Pageable pageable) {
        if (!StringUtils.hasText(keyword)) {
            return redHeroRepository.findAll(pageable);
        }
        return redHeroRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }

    // 获取相关英雄（排除当前英雄，按相似性）
    public List<RedHero> findRelatedHeroes(Integer currentId, int limit) {
        List<RedHero> allHeroes = redHeroRepository.findAll();
        return allHeroes.stream()
                .filter(hero -> !hero.getId().equals(currentId))
                .limit(limit)
                .toList();
    }

    // 获取上一个英雄（按ID）
    public RedHero getPrevHero(Integer currentId) {
        List<RedHero> heroes = redHeroRepository.findAllByOrderByIdDesc();
        int currentIndex = -1;
        for (int i = 0; i < heroes.size(); i++) {
            if (heroes.get(i).getId().equals(currentId)) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex != -1 && currentIndex + 1 < heroes.size()) {
            return heroes.get(currentIndex + 1);
        }
        return null;
    }

    // 获取下一个英雄（按ID）
    public RedHero getNextHero(Integer currentId) {
        List<RedHero> heroes = redHeroRepository.findAllByOrderByIdDesc();
        int currentIndex = -1;
        for (int i = 0; i < heroes.size(); i++) {
            if (heroes.get(i).getId().equals(currentId)) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex > 0) {
            return heroes.get(currentIndex - 1);
        }
        return null;
    }

    public RedHero save(RedHero hero) {
        return redHeroRepository.save(hero);

    public void deleteById(Integer id) {
        redHeroRepository.deleteById(id);
    }
}