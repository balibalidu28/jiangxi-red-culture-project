package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedStory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedStoryRepository extends JpaRepository<RedStory, Integer> {
    //TODD:Page<RedStory> findByTitleContainingIgnoreCase(String kw, Pageable pageable);
}