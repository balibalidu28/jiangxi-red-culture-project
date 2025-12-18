package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedExplore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RedExploreRepository extends JpaRepository<RedExplore, Integer> {
    // TODO(可选): List<RedExplore> findByDateGreaterThanEqual(LocalDate today);
}