package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedStory;
import com.redculture.jxredculturedisplay.repository.RedStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RedStoryService {

    @Autowired
    private RedStoryRepository redStoryRepository;

    public long count() {
        return redStoryRepository.count();
    }

    public List<RedStory> listTop(int n) {
        Pageable pageable = PageRequest.of(0, n, Sort.by(Sort.Direction.DESC, "createdAt"));
        return redStoryRepository.findAll(pageable).getContent();
    }

    public Page<RedStory> page(int page, int size, String kw) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        if (kw == null || kw.trim().isEmpty()) {
            return redStoryRepository.findAll(pageable);
        } else {
            return redStoryRepository.findByTitleContainingIgnoreCase(kw, pageable);
        }
    }

    public RedStory getOrThrow(Integer id) {
        Optional<RedStory> optionalStory = redStoryRepository.findById(id);
        if (optionalStory.isPresent()) {
            return optionalStory.get();
        } else {
            throw new RuntimeException("RedStory with id " + id + " not found");
        }
    }

    public RedStory create(RedStory story) {
        if (story.getTitle() == null || story.getTitle().isEmpty()) {
            throw new IllegalArgumentException("故事标题不能为空");
        }
        if (story.getContent() == null || story.getContent().isEmpty()) {
            throw new IllegalArgumentException("故事内容不能为空");
        }

        story.setId(null);
        return redStoryRepository.save(story);
    }

    public RedStory update(Integer id, RedStory story) {
        RedStory dbStory = getOrThrow(id);

        // 更新所有字段
        dbStory.setTitle(story.getTitle());
        dbStory.setContent(story.getContent());
        dbStory.setSource(story.getSource());
        dbStory.setSummary(story.getSummary());
        dbStory.setStoryTime(story.getStoryTime());
        dbStory.setLocation(story.getLocation());
        dbStory.setHeroName(story.getHeroName());

        // 只有在提供了新图片URL时才更新
        if (story.getImageUrl() != null) {
            dbStory.setImageUrl(story.getImageUrl());
        }

        return redStoryRepository.save(dbStory);
    }

    public void delete(Integer id) {
        RedStory story = getOrThrow(id);
        redStoryRepository.delete(story);
    }

    public List<RedStory> listAll() {
        return redStoryRepository.findAll();
    }

    public RedStory save(RedStory story) {
        return redStoryRepository.save(story);
    }

    public void deleteById(Integer id) {
        redStoryRepository.deleteById(id);
    }
}