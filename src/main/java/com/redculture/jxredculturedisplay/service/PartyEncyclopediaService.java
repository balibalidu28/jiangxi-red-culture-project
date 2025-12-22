package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import com.redculture.jxredculturedisplay.repository.PartyEncyclopediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest; // 分页工具
import org.springframework.data.domain.Sort; // 排序工具
import org.springframework.stereotype.Service;

import java.util.List;

@Service // 标记这是业务逻辑层组件
public class PartyEncyclopediaService {

    // 1. 注入 Repository (仓库)
    @Autowired
    private PartyEncyclopediaRepository repository;

    /**
     * 统计总数（后台管理可能需要显示“当前共有xx个词条”）
     */
    public long count() {
        return repository.count();
    }

    /**
     * 获取最新的 N 条数据（给首页 D同学 用的）
     * 逻辑：按 ID 倒序排列（最新的ID最大），取前 n 条
     */
    public List<PartyEncyclopedia> listTop(int n) {
        // PageRequest.of(页码0, 每页数量n, 排序方式)
        // Sort.Direction.DESC 表示倒序（从大到小）
        return repository.findAll(
                PageRequest.of(0, n, Sort.by(Sort.Direction.DESC, "id"))
        ).getContent();
    }

    /**
     * 获取所有数据
     */
    public List<PartyEncyclopedia> listAll() {
        return repository.findAll();
    }

    /**
     * 搜索功能
     * 逻辑：如果 kw 为空，查全部；如果不为空，搜标题或内容
     */
    public List<PartyEncyclopedia> search(String kw) {
        if (kw == null || kw.trim().isEmpty()) {
            return listAll();
        }
        // 调用 Repository 里那个很长的方法
        // 两个参数都传 kw，表示标题包含 kw 或者 内容包含 kw 都可以
        return repository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(kw, kw);
    }

    /**
     * 根据ID获取详情，找不到就报错
     * 用于 编辑页面 和 详情页面
     */
    public PartyEncyclopedia getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到该词条，ID: " + id));
    }

    /**
     * 新增词条（后台管理用）
     */
    public PartyEncyclopedia create(PartyEncyclopedia item) {
        // 1. 简单校验
        if (item.getTitle() == null || item.getTitle().isEmpty()) {
            throw new RuntimeException("标题不能为空");
        }
        if (item.getContent() == null || item.getContent().isEmpty()) {
            throw new RuntimeException("内容不能为空");
        }

        // 2. 强制 ID 为 null，确保是“新增”而不是“修改”
        item.setId(null);

        // 3. 保存
        return repository.save(item);
    }

    /**
     * 修改词条（后台管理用）
     */
    public PartyEncyclopedia update(Long id, PartyEncyclopedia item) {
        // 1. 先查数据库里有没有这条
        PartyEncyclopedia dbItem = getOrThrow(id);

        // 2. 更新字段（只更新允许修改的）
        dbItem.setTitle(item.getTitle());
        dbItem.setContent(item.getContent());
        if (item.getImageUrl() != null) {
            dbItem.setImageUrl(item.getImageUrl());
        }

        // 3. 保存（JPA会自动判断是更新）
        return repository.save(dbItem);
    }

    /**
     * 删除词条（后台管理用）
     */
    public void delete(Long id) {
        // 1. 先确保它存在，不存在会报错
        getOrThrow(id);
        // 2. 删除
        repository.deleteById(id);
    }

    public PartyEncyclopedia save(PartyEncyclopedia encyclopedia) {
        // 调用 create 方法或直接保存
        // 或者如果已经有 ID 就更新：
         if (encyclopedia.getId() != null) {
             return update(encyclopedia.getId(), encyclopedia);
         } else {
             return create(encyclopedia);
         }
    }

    public void deleteById(Long id) {
        if (id == null) {
            throw new RuntimeException("ID不能为空");
        }

        // 检查是否存在
        if (!repository.existsById(id)) {
            throw new RuntimeException("找不到ID为 " + id + " 的词条");
        }

        // 删除
        repository.deleteById(id);
    }

    public PartyEncyclopedia findById(Long id) {
        // 使用 JPA 的 findById 方法
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("百科条目不存在，ID: " + id));
    }
}