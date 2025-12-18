package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.PartyEncyclopedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartyEncyclopediaRepository extends JpaRepository<PartyEncyclopedia, Integer> {
    // TODO(必须): List<PartyEncyclopedia> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String kw1, String kw2);
}