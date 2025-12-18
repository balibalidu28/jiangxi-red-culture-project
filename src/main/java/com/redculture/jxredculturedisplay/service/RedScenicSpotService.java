package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedScenicSpot;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RedScenicSpotService {
    // TODO: 注入 RedScenicSpotRepository

    public long count() {
        /* 1) repo.count() */
        throw new UnsupportedOperationException("TODO");
    }

    public List<RedScenicSpot> listTop(int n) {
        /*
         * 1) 查询前n条（可后续加排序字段）
         * 2) return（供首页推荐）
         */
        throw new UnsupportedOperationException("TODO");
    }

    public List<RedScenicSpot> list(String location) {
        /*
         * 1) location为空 -> repo.findAll()
         * 2) location不为空 -> repo按location筛选（可选实现）
         * 3) return
         */
        throw new UnsupportedOperationException("TODO");
    }

    public RedScenicSpot getOrThrow(Integer id) {
        /* 1) repo.findById 2) 不存在抛异常 */
        throw new UnsupportedOperationException("TODO");
    }

    public RedScenicSpot create(RedScenicSpot spot) {
        /*
         * 1) 校验name必填（location建议必填）
         * 2) spot.id=null
         * 3) repo.save
         * 4) return
         */
        throw new UnsupportedOperationException("TODO");
    }

    public RedScenicSpot update(Integer id, RedScenicSpot spot) {
        /*
         * 1) db=getOrThrow(id)
         * 2) 更新字段：name/description/location/imageUrl
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