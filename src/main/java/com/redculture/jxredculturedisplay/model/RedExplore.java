package com.redculture.jxredculturedisplay.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "red_explore")
public class RedExplore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "image", length = 500)
    private String image;

    @Column(name = "city", nullable = false, length = 50)
    private String city;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "location", nullable = false, length = 200)
    private String location;

    @Column(name = "max_participants", nullable = false)
    private Integer maxParticipants = 50;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ActivityStatus status = ActivityStatus.UPCOMING;

    @Column(name = "organization", nullable = false, length = 100)
    private String organization;

    @Column(name = "registration_email", nullable = false, length = 100)
    private String registrationEmail;

    @Column(name = "registration_form", length = 500)
    private String registrationForm;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "schedule", columnDefinition = "TEXT")
    private String schedule;

    @Column(name = "registration_deadline", nullable = false)
    private LocalDate registrationDeadline;

    // 构造函数
    public RedExplore() {
    }

    public RedExplore(String title, String city, LocalDateTime startTime,
                      LocalDateTime endTime, String location, String organization,
                      String registrationEmail, LocalDate registrationDeadline) {
        this.title = title;
        this.city = city;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.organization = organization;
        this.registrationEmail = registrationEmail;
        this.registrationDeadline = registrationDeadline;
    }

    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public ActivityStatus getStatus() {
        return status;
    }

    public void setStatus(ActivityStatus status) {
        this.status = status;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getRegistrationEmail() {
        return registrationEmail;
    }

    public void setRegistrationEmail(String registrationEmail) {
        this.registrationEmail = registrationEmail;
    }

    public String getRegistrationForm() {
        return registrationForm;
    }

    public void setRegistrationForm(String registrationForm) {
        this.registrationForm = registrationForm;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSchedule() {
        return schedule;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    public LocalDate getRegistrationDeadline() {
        return registrationDeadline;
    }

    public void setRegistrationDeadline(LocalDate registrationDeadline) {
        this.registrationDeadline = registrationDeadline;
    }

    // 状态枚举
    public enum ActivityStatus {
        UPCOMING("upcoming"),
        ONGOING("ongoing"),
        ENDED("ended");

        private final String value;

        ActivityStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static ActivityStatus fromValue(String value) {
            for (ActivityStatus status : ActivityStatus.values()) {
                if (status.value.equalsIgnoreCase(value)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("未知的活动状态: " + value);
        }
    }

    // toString() 方法
    @Override
    public String toString() {
        return "RedExplore{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", city='" + city + '\'' +
                ", startTime=" + startTime +
                ", status=" + status +
                '}';
    }
}