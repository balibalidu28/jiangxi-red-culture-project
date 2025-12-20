package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedHero;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RedHeroRepository extends JpaRepository<RedHero, Integer> {
    //TODD:List<RedHero> findByNameContainingIgnoreCase(String kw);
}