package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.ScenicSpot;
import com.redculture.jxredculturedisplay.repository.ScenicSpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 服务层：景点信息业务逻辑。
 */
@Service
public class ScenicSpotService {

    @Autowired
    private ScenicSpotRepository scenicSpotRepository;

    public List<ScenicSpot> getAllScenicSpots() {
        return scenicSpotRepository.findAll();
    }

    public ScenicSpot addScenicSpot(ScenicSpot scenicSpot) {
        return scenicSpotRepository.save(scenicSpot);
    }

    public ScenicSpot getScenicSpotById(Long id) {
        return scenicSpotRepository.findById(id).orElse(null);
    }

    public void deleteScenicSpot(Long id) {
        scenicSpotRepository.deleteById(id);
    }
}