package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartyEncyclopediaRepository extends JpaRepository<PartyEncyclopedia, Integer> {

    // 模糊搜索
    List<PartyEncyclopedia> findByTitleContaining(String keyword);

    // 只要继承了 JpaRepository，findAll() 方法是自带的，不需要自己写！
}