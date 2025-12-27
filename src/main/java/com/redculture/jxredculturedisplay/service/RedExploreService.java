package com.redculture.jxredculturedisplay.service;

import com.redculture.jxredculturedisplay.model.RedExplore;
import com.redculture.jxredculturedisplay.repository.RedExploreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RedExploreService {

    @Autowired
    private RedExploreRepository exploreRepository;

    // 获取活动总数
    public long count() {
        return exploreRepository.count();
    }

    // 获取前n个活动（按开始时间升序）
    public List<RedExplore> listTop(int n) {
        return exploreRepository.findTopNByOrderByStartTimeAsc(n);
    }

    // 根据条件查询活动列表
    public List<RedExplore> list(Boolean upcoming) {
        LocalDateTime now = LocalDateTime.now();

        if (upcoming == null) {
            // 返回所有活动，按开始时间排序
            return exploreRepository.findAllByOrderByStartTimeAsc();
        } else if (upcoming) {
            // 返回即将开始的活动（开始时间大于现在）
            return exploreRepository.findByStartTimeAfterOrderByStartTimeAsc(now);
        } else {
            // 返回已结束的活动（结束时间小于现在）
            return exploreRepository.findByEndTimeBeforeOrderByStartTimeAsc(now);
        }
    }

    // 根据ID获取活动，不存在则抛出异常
    public RedExplore getOrThrow(Integer id) {
        return exploreRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("活动不存在，ID: " + id));
    }

    // 创建新活动
    public RedExplore create(RedExplore item) {
        // 验证必填字段
        if (item.getTitle() == null || item.getTitle().trim().isEmpty()) {
            throw new RuntimeException("活动标题不能为空");
        }

        // 确保ID为null（由数据库生成）
        item.setId(null);

        // 设置默认值
        if (item.getStatus() == null) {
            item.setStatus(RedExplore.ActivityStatus.UPCOMING);
        }
        if (item.getMaxParticipants() == null) {
            item.setMaxParticipants(50);
        }
        if (item.getStartTime() == null) {
            item.setStartTime(LocalDateTime.now().plusDays(1)); // 默认明天开始
        }
        if (item.getEndTime() == null) {
            item.setEndTime(item.getStartTime().plusDays(2)); // 默认持续2天
        }
        if (item.getRegistrationDeadline() == null) {
            item.setRegistrationDeadline(LocalDate.now().plusDays(7)); // 默认7天后截止
        }

        return exploreRepository.save(item);
    }

    // 更新活动
    public RedExplore update(Integer id, RedExplore item) {
        // 查找现有活动
        RedExplore existing = getOrThrow(id);

        // 更新可修改字段
        if (item.getTitle() != null) {
            existing.setTitle(item.getTitle().trim());
        }
        if (item.getImage() != null) {
            existing.setImage(item.getImage());
        }
        if (item.getCity() != null) {
            existing.setCity(item.getCity());
        }
        if (item.getStartTime() != null) {
            existing.setStartTime(item.getStartTime());
        }
        if (item.getEndTime() != null) {
            existing.setEndTime(item.getEndTime());
        }
        if (item.getLocation() != null) {
            existing.setLocation(item.getLocation());
        }
        if (item.getMaxParticipants() != null) {
            existing.setMaxParticipants(item.getMaxParticipants());
        }
        if (item.getStatus() != null) {
            existing.setStatus(item.getStatus());
        }
        if (item.getOrganization() != null) {
            existing.setOrganization(item.getOrganization());
        }
        if (item.getRegistrationEmail() != null) {
            existing.setRegistrationEmail(item.getRegistrationEmail());
        }
        if (item.getRegistrationForm() != null) {
            existing.setRegistrationForm(item.getRegistrationForm());
        }
        if (item.getDescription() != null) {
            existing.setDescription(item.getDescription());
        }
        if (item.getSchedule() != null) {
            existing.setSchedule(item.getSchedule());
        }
        if (item.getRegistrationDeadline() != null) {
            existing.setRegistrationDeadline(item.getRegistrationDeadline());
        }

        return exploreRepository.save(existing);
    }

    // 删除活动
    public void delete(Integer id) {
        if (!exploreRepository.existsById(Long.valueOf(id))) {
            throw new RuntimeException("活动不存在，ID: " + id);
        }
        exploreRepository.deleteById(Long.valueOf(id));
    }

    // 获取所有活动（AdminController需要）
    public List<RedExplore> listAll() {
        return exploreRepository.findAllByOrderByStartTimeAsc();
    }

    // 保存活动（AdminController需要 - 创建或更新）
    public RedExplore save(RedExplore explore) {
        if (explore.getId() == null) {
            return create(explore);
        } else {
            return update(Math.toIntExact(explore.getId()), explore);
        }
    }

    // 根据ID删除活动（AdminController需要）
    public void deleteById(Integer id) {
        delete(id);
    }

    // 可选：搜索功能
    public List<RedExplore> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return listAll();
        }
        String searchTerm = "%" + keyword.trim() + "%";
        return exploreRepository.searchByTitleOrCityOrLocation(searchTerm);
    }

    // 可选：更新活动状态（自动将过期的活动状态改为ENDED）
    @Transactional
    public void updateActivityStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<RedExplore> ongoingActivities = exploreRepository.findByEndTimeBeforeAndStatusNot(now, RedExplore.ActivityStatus.ENDED);

        for (RedExplore activity : ongoingActivities) {
            activity.setStatus(RedExplore.ActivityStatus.ENDED);
            exploreRepository.save(activity);
        }
    }

    // 可选：检查活动是否可报名
    public boolean isRegistrationOpen(Integer id) {
        RedExplore activity = getOrThrow(id);
        LocalDate today = LocalDate.now();

        return activity.getStatus() == RedExplore.ActivityStatus.UPCOMING &&
                (activity.getRegistrationDeadline() == null ||
                        !today.isAfter(activity.getRegistrationDeadline()));
    }
}