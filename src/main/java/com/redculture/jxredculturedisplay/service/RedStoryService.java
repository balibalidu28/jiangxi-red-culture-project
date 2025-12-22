// RedStoryService.java
package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedStory;
import com.redculture.jxredculturedisplay.repository.RedStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RedStoryService {

    @Autowired
    private RedStoryRepository redStoryRepository;

    /**
     * 获取故事总数
     */
    public long getTotalCount() {
        Long count = redStoryRepository.countAllStories();
        return count != null ? count : 0L;
    }

    /**
     * 分页查询故事（带搜索功能）
     */
    public Page<RedStory> getStoriesByPage(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        if (keyword != null && !keyword.trim().isEmpty()) {
            // 搜索模式
            return redStoryRepository.searchByKeyword(keyword.trim(), pageable);
        } else {
            // 普通分页模式
            return redStoryRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
    }

    /**
     * 获取单个故事详情（增加阅读数）
     */
    public RedStory getStoryById(Integer id) {
        Optional<RedStory> optional = redStoryRepository.findById(id);
        if (optional.isPresent()) {
            RedStory story = optional.get();
            // 增加阅读数
            story.setViewCount(story.getViewCount() + 1);
            return redStoryRepository.save(story);
        }
        throw new RuntimeException("未找到ID为 " + id + " 的故事");
    }

    /**
     * 获取推荐的故事
     */
    public List<RedStory> getFeaturedStories(int limit) {
        List<RedStory> featuredStories = redStoryRepository.findByIsFeaturedTrueOrderByCreatedAtDesc();
        if (featuredStories.size() > limit) {
            return featuredStories.subList(0, limit);
        }
        return featuredStories;
    }

    /**
     * 获取最新的故事
     */
    public List<RedStory> getLatestStories(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return redStoryRepository.findLatestStories(pageable);
    }

    /**
     * 根据英雄名称获取相关故事
     */
    public List<RedStory> getStoriesByHeroName(String heroName, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<RedStory> result = redStoryRepository.findByHeroName(heroName, pageable);
        return result.getContent();
    }

    /**
     * 获取相关故事（排除当前故事）
     */
    public List<RedStory> getRelatedStories(RedStory currentStory, int limit) {
        List<RedStory> relatedStories = new java.util.ArrayList<>();

        // 1. 首先尝试根据英雄名称查找
        if (currentStory.getHeroName() != null && !currentStory.getHeroName().trim().isEmpty()) {
            List<RedStory> heroStories = redStoryRepository.findByHeroName(currentStory.getHeroName().trim());
            for (RedStory story : heroStories) {
                if (!story.getId().equals(currentStory.getId()) && !relatedStories.contains(story)) {
                    relatedStories.add(story);
                    if (relatedStories.size() >= limit) {
                        return relatedStories;
                    }
                }
            }
        }

        // 2. 如果相关故事不足，用推荐故事补充
        if (relatedStories.size() < limit) {
            List<RedStory> featuredStories = getFeaturedStories(limit * 2);
            for (RedStory story : featuredStories) {
                if (!story.getId().equals(currentStory.getId()) && !relatedStories.contains(story)) {
                    relatedStories.add(story);
                    if (relatedStories.size() >= limit) {
                        return relatedStories;
                    }
                }
            }
        }

        // 3. 如果还是不足，用最新故事补充
        if (relatedStories.size() < limit) {
            List<RedStory> latestStories = getLatestStories(limit * 2);
            for (RedStory story : latestStories) {
                if (!story.getId().equals(currentStory.getId()) && !relatedStories.contains(story)) {
                    relatedStories.add(story);
                    if (relatedStories.size() >= limit) {
                        return relatedStories;
                    }
                }
            }
        }

        return relatedStories;
    }

    /**
     * 创建新故事
     */
    public RedStory createStory(RedStory story) {
        story.setCreatedAt(LocalDateTime.now());
        story.setUpdatedAt(LocalDateTime.now());
        if (story.getViewCount() == null) {
            story.setViewCount(0);
        }
        if (story.getIsFeatured() == null) {
            story.setIsFeatured(false);
        }
        return redStoryRepository.save(story);
    }

    /**
     * 更新故事
     */
    public RedStory updateStory(Integer id, RedStory storyDetails) {
        RedStory story = getStoryById(id);

        if (storyDetails.getTitle() != null) {
            story.setTitle(storyDetails.getTitle());
        }
        if (storyDetails.getContent() != null) {
            story.setContent(storyDetails.getContent());
        }
        if (storyDetails.getSummary() != null) {
            story.setSummary(storyDetails.getSummary());
        }
        if (storyDetails.getImageUrl() != null) {
            story.setImageUrl(storyDetails.getImageUrl());
        }
        if (storyDetails.getAuthor() != null) {
            story.setAuthor(storyDetails.getAuthor());
        }
        if (storyDetails.getHeroName() != null) {
            story.setHeroName(storyDetails.getHeroName());
        }
        if (storyDetails.getLocation() != null) {
            story.setLocation(storyDetails.getLocation());
        }
        if (storyDetails.getStoryTime() != null) {
            story.setStoryTime(storyDetails.getStoryTime());
        }
        if (storyDetails.getSource() != null) {
            story.setSource(storyDetails.getSource());
        }
        if (storyDetails.getIsFeatured() != null) {
            story.setIsFeatured(storyDetails.getIsFeatured());
        }

        story.setUpdatedAt(LocalDateTime.now());
        return redStoryRepository.save(story);
    }

    /**
     * 删除故事
     */
    public void deleteStory(Integer id) {
        if (redStoryRepository.existsById(id)) {
            redStoryRepository.deleteById(id);
        } else {
            throw new RuntimeException("未找到ID为 " + id + " 的故事");
        }
    }
}