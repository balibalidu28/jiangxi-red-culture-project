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

    // 统计卡片悬停效果
    const countCards = document.querySelectorAll('.count-card');
    countCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

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

    // 新闻日期导航切换
    const dateTabs = document.querySelectorAll('.news-date-nav span');
    dateTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            dateTabs.forEach(t => t.classList.remove('active'));
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

    // 登录图标悬停效果
    const loginIcon = document.querySelector('.login-icon');
    if (loginIcon) {
        loginIcon.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255,255,255,0.1)';
        });

        loginIcon.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
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
});