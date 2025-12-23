package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedStory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RedStoryService {
    // TODO: 注入 RedStoryRepository

    public long count() {
        throw new UnsupportedOperationException("TODO");
    }

    public List<RedStory> listTop(int n) {
        /*
         * 1) 按createdAt倒序取前n条（Sort + PageRequest）
         * 2) return（供首页最新故事）
         */
        throw new UnsupportedOperationException("TODO");
    }

    public Page<RedStory> page(int page, int size, String kw) {
        /*
         * 1) Pageable = PageRequest.of(page,size, Sort.by(DESC,"createdAt"))
         * 2) kw为空 -> repo.findAll(pageable)
         * 3) kw不为空 -> repo.findByTitleContainingIgnoreCase(kw,pageable)
         * 4) return Page
         */
        throw new UnsupportedOperationException("TODO");
    }

    public RedStory getOrThrow(Integer id) {
        throw new UnsupportedOperationException("TODO");
    }

    public RedStory create(RedStory story) {
        throw new UnsupportedOperationException("TODO");
    }

    public RedStory update(Integer id, RedStory story) {
        throw new UnsupportedOperationException("TODO");
    }

    public void delete(Integer id) {
        throw new UnsupportedOperationException("TODO");
    }//

    public List<RedStory> listAll() {
        throw new UnsupportedOperationException("TODO");
    }

    public RedStory save(RedStory story) {
        throw new UnsupportedOperationException("TODO");
    }

    public void deleteById(Integer id) {
    }

}