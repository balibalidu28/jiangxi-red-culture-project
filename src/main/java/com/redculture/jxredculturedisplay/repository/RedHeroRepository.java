package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedHero;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RedHeroRepository extends JpaRepository<RedHero, Integer> {
    // TODO(可选): List<RedHero> findByNameContainingIgnoreCase(String kw);
}//