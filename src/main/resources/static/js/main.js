// main.js - 通用函数

// 如果还没有定义，添加这些工具函数
if (typeof window.formatDate === 'undefined') {
    window.formatDate = function(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN');
    };
}

if (typeof window.truncateText === 'undefined') {
    window.truncateText = function(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };
}

// 首页特定交互
document.addEventListener('DOMContentLoaded', function() {
    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.card-red');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 搜索框聚焦效果
    const searchInputs = document.querySelectorAll('input[name="kw"]');
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('border', 'border-danger', 'rounded');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('border', 'border-danger', 'rounded');
        });
    });

    // 平滑滚动到功能区域
    const exploreBtn = document.querySelector('a[href="#features"]');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                featuresSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // 导航链接悬停效果
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 新闻链接悬停效果
    const newsLinks = document.querySelectorAll('.news-list a');
    newsLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(3px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // 新闻标签切换
    const newsTabs = document.querySelectorAll('.news-tabs span');
    newsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            newsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 轮播图自动播放
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        const carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            wrap: true
        });
    }

    // 更多链接悬停效果
    const moreLinks = document.querySelectorAll('.more-link a');
    moreLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(3px)';
            }
        });

        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(0)';
            }
        });
    });

    // 功能区域按钮跳转模拟
    const featureBtns = document.querySelectorAll('#features .btn-outline-danger');
    featureBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
    });
});





