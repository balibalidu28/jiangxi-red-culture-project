package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedHero;
import com.redculture.jxredculturedisplay.repository.RedHeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RedHeroService {

    @Autowired
    private RedHeroRepository redHeroRepository;

    /**
     * 获取红色英雄的总数
     * @return 红色英雄的总数
     */
    public long count() {
        return redHeroRepository.count();
    }

    /**
     * 获取前 n 个红色英雄
     * @param n 要获取的红色英雄数量
     * @return 前 n 个红色英雄列表
     */
    public List<RedHero> listTop(int n) {
        return redHeroRepository.findAll(PageRequest.of(0, n)).getContent();
    }

    /**
     * 获取所有红色英雄
     * @return 所有红色英雄列表
     */
    public List<RedHero> listAll() {
        return redHeroRepository.findAll();
    }

    /**
     * 根据 ID 获取红色英雄，如果不存在则抛出异常
     * @param id 红色英雄的 ID
     * @return 红色英雄实体
     */
    public RedHero getOrThrow(Integer id) {
        Optional<RedHero> optionalHero = redHeroRepository.findById(id);
        if (optionalHero.isPresent()) {
            return optionalHero.get();
        } else {
            throw new RuntimeException("RedHero with id " + id + " not found");
        }
    }

    /**
     * 创建一个新的红色英雄
     * @param hero 红色英雄实体
     * @return 创建后的红色英雄实体
     */
    public RedHero create(RedHero hero) {
        if (hero.getName() == null || hero.getName().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        hero.setId(null); // 确保创建时 ID 为空
        return redHeroRepository.save(hero);
    }

    /**
     * 更新一个红色英雄的信息
     * @param id 红色英雄的 ID
     * @param hero 红色英雄实体
     * @return 更新后的红色英雄实体
     */
    public RedHero update(Integer id, RedHero hero) {
        RedHero dbHero = getOrThrow(id);
        // 更新所有字段
        dbHero.setName(hero.getName());
        dbHero.setDescription(hero.getDescription());
        dbHero.setImageUrl(hero.getImageUrl());
        dbHero.setAlias(hero.getAlias());
        dbHero.setTitle(hero.getTitle());
        dbHero.setCategory(hero.getCategory());
        dbHero.setContent(hero.getContent());
        dbHero.setGender(hero.getGender());
        dbHero.setEthnicity(hero.getEthnicity());
        dbHero.setBirthDate(hero.getBirthDate());
        dbHero.setDeathDate(hero.getDeathDate());
        dbHero.setBirthplace(hero.getBirthplace());
        dbHero.setPoliticalStatus(hero.getPoliticalStatus());

        return redHeroRepository.save(dbHero);
    }

    /**
     * 删除一个红色英雄
     * @param id 红色英雄的 ID
     */
    public void delete(Integer id) {
        redHeroRepository.deleteById(id);
    }

    /**
     * 保存一个红色英雄
     * @param hero 红色英雄实体
     * @return 保存后的红色英雄实体
     */
    public RedHero save(RedHero hero) {
        return redHeroRepository.save(hero);
    }

    // 1. 使用继承的方法
    public RedHero getHeroById(Integer id) {
        return redHeroRepository.findById(id).orElse(null);
    }

    // 2. 使用自定义的方法
    public List<RedHero> searchHeroesByName(String keyword) {
        return redHeroRepository.findByNameContainingIgnoreCase(keyword);
    }

    // 3. 使用保存方法
    public RedHero createHero(RedHero hero) {
        return redHeroRepository.save(hero);
    }

    public void deleteById(Integer id) {
        redHeroRepository.deleteById(id);
    }

    // 根据类别查询英雄
    public List<RedHero> findByCategory(String category) {
        return redHeroRepository.findByCategory(category);
    }

    // 根据籍贯查询英雄
    public List<RedHero> findByBirthplace(String birthplace) {
        return redHeroRepository.findByBirthplaceContainingIgnoreCase(birthplace);
    }
}