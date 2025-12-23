


document.addEventListener('DOMContentLoaded', function() {
    // 搜索框聚焦效果
    const searchInput = document.getElementById('keyword');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('border', 'border-danger', 'rounded');
        });

        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('border', 'border-danger', 'rounded');
        });
    }

    // 卡片悬停效果
    const heroCards = document.querySelectorAll('.hero-card');
    heroCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 自动完成搜索建议（简单版）
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        if (this.value.length >= 2) {
            searchTimeout = setTimeout(function() {
                // 这里可以添加AJAX请求获取搜索建议
                console.log('搜索关键词:', searchInput.value);
            }, 300);
        }
    });
});