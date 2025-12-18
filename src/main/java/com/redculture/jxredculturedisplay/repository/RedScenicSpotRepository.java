package com.redculture.jxredculturedisplay.repository;

import com.redculture.jxredculturedisplay.model.RedScenicSpot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RedScenicSpotRepository extends JpaRepository<RedScenicSpot, Integer> {
    // TODO(可选): List<RedScenicSpot> findByLocationContainingIgnoreCase(String location);
}