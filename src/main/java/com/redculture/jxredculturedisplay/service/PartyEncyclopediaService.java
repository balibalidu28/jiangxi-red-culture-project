package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartyEncyclopediaService {
    // TODO: 注入 PartyEncyclopediaRepository

    public long count() {
        /* 1) repo.count() 2) return */
        throw new UnsupportedOperationException("TODO");
    }

    public List<PartyEncyclopedia> listTop(int n) {
        /*
         * 1) PageRequest.of(0,n)
         * 2) repo.findAll(pageable).getContent()
         * 3) return
         */
        throw new UnsupportedOperationException("TODO");
    }

    public List<PartyEncyclopedia> listAll() {
        /* 1) repo.findAll() 2) return */
        throw new UnsupportedOperationException("TODO");
    }

    public List<PartyEncyclopedia> search(String kw) {
        /*
         * 1) kw为空 -> listAll()
         * 2) kw不为空 -> repo模糊查询(title/content)
         *    findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(kw, kw)
         * 3) return
         */
        throw new UnsupportedOperationException("TODO");
    }

    public PartyEncyclopedia getOrThrow(Integer id) {
        /* 1) repo.findById 2) 不存在抛异常 3) return */
        throw new UnsupportedOperationException("TODO");
    }

    public PartyEncyclopedia create(PartyEncyclopedia item) {
        /*
         * 1) 校验title/content必填
         * 2) item.id=null
         * 3) repo.save(item)
         * 4) return
         */
        throw new UnsupportedOperationException("TODO");
    }

    public PartyEncyclopedia update(Integer id, PartyEncyclopedia item) {
        /*
         * 1) db=getOrThrow(id)
         * 2) 更新字段：title/content/imageUrl
         * 3) repo.save(db)
         * 4) return
         */
        throw new UnsupportedOperationException("TODO");
    }

    public void delete(Integer id) {
        /* 1) repo.deleteById(id)（可选先getOrThrow） */
        throw new UnsupportedOperationException("TODO");
    }
}