package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedStory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RedStoryRepository extends JpaRepository<RedStory, Integer> {
    // TODO(建议): Page<RedStory> findByTitleContainingIgnoreCase(String kw, Pageable pageable);
}//