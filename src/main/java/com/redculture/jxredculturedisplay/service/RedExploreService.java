package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedExplore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RedExploreService {
    // TODO: 注入 RedExploreRepository

    public long count() {
        /* 1) repo.count() */
        throw new UnsupportedOperationException("TODO");
    }

    public List<RedExplore> listTop(int n) {
        /*
         * 1) 查询前n条活动（建议按date排序）
         * 2) return（供首页预告）
         */
        throw new UnsupportedOperationException("TODO");
    }

    public List<RedExplore> list(Boolean upcoming) {
        /*
         * 1) upcoming为空 -> repo.findAll()
         * 2) upcoming=true -> date>=today（需要repository方法）
         * 3) return
         */
        throw new UnsupportedOperationException("TODO");
    }

    public RedExplore getOrThrow(Integer id) {
        /* 1) repo.findById 2) 不存在抛异常 */
        throw new UnsupportedOperationException("TODO");
    }

    public RedExplore create(RedExplore item) {
        /*
         * 1) 校验title必填
         * 2) item.id=null
         * 3) repo.save
         * 4) return
         */
        throw new UnsupportedOperationException("TODO");
    }

    public RedExplore update(Integer id, RedExplore item) {
        /*
         * 1) db=getOrThrow(id)
         * 2) 更新字段：title/content/date/location
         * 3) repo.save(db)
         * 4) return
         */
        throw new UnsupportedOperationException("TODO");
    }

    public void delete(Integer id) {
        /* 1) repo.deleteById(id) */
        throw new UnsupportedOperationException("TODO");
    }
}