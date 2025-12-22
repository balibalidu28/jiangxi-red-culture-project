// 通过标签快速搜索
function searchByTag(tag) {
    window.location.href = '/stories?kw=' + encodeURIComponent(tag);
}

// 清空搜索
function clearSearch() {
    window.location.href = '/stories';
}

// 搜索框自动聚焦
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[name="kw"]');
    if (searchInput && searchInput.value) {
        searchInput.focus();
        searchInput.select();
    }

    // 添加卡片悬停效果
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 过滤标签点击效果
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
});