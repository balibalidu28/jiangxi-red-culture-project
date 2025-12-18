package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedHero;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RedHeroService {
    // TODO: 注入 RedHeroRepository

    public long count() {
        /* 1) repo.count() 2) return */
        throw new UnsupportedOperationException("TODO");
    }

    public List<RedHero> listTop(int n) {
        /* 1) PageRequest.of(0,n) 2) repo.findAll(pageable).getContent() 3) return */
        throw new UnsupportedOperationException("TODO");
    }

    public List<RedHero> listAll() {
        /* 1) repo.findAll() 2) return */
        throw new UnsupportedOperationException("TODO");
    }

    public RedHero getOrThrow(Integer id) {
        /* 1) repo.findById 2) 不存在抛异常 3) return */
        throw new UnsupportedOperationException("TODO");
    }

    public RedHero create(RedHero hero) {
        /* 1) 校验name必填 2) id置空 3) repo.save 4) return */
        throw new UnsupportedOperationException("TODO");
    }

    public RedHero update(Integer id, RedHero hero) {
        /* 1) db=getOrThrow 2) 更新字段 3) repo.save 4) return */
        throw new UnsupportedOperationException("TODO");
    }

    public void delete(Integer id) {
        /* 1) repo.deleteById(id)（可选先getOrThrow） */
        throw new UnsupportedOperationException("TODO");
    }

    public void deleteById(Integer id) {

    }

    public RedHero save(RedHero hero) {
        throw new UnsupportedOperationException("TODO");
    }
}