// 当前页码
let currentPage = 0;
const pageSize = 10;
let keyword = '';
let sortType = 'newest';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 从URL参数获取搜索关键词
    const urlParams = new URLSearchParams(window.location.search);
    keyword = urlParams.get('kw') || '';

    if (keyword) {
        document.getElementById('keyword').value = keyword;
        document.getElementById('searchResult').innerHTML = '搜索结果：' + keyword;
    }

    // 加载数据
    loadData();

    // 搜索表单提交
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        keyword = document.getElementById('keyword').value;
        currentPage = 0;
        loadStories(sortType);
    });
});

// 加载所有数据
function loadData() {
    // 只加载列表数据
    loadStories(sortType);
}

// 加载故事列表
async function loadStories(sort = 'newest') {
    sortType = sort;

    try {
        const response = await fetch(
            `http://localhost:8080/stories/api?page=${currentPage}&size=${pageSize}&kw=${encodeURIComponent(keyword)}`
        );
        const data = await response.json();

        // 更新统计信息
        document.getElementById('totalItems').textContent = data.totalElements;
        document.getElementById('totalCount').textContent = `共 ${data.totalElements} 篇故事`;

        // 显示故事列表
        displayStories(data.content);

        // 显示分页
        if (data.totalPages > 1) {
            displayPagination(data.totalPages);
            document.getElementById('paginationContainer').style.display = 'block';
        } else {
            document.getElementById('paginationContainer').style.display = 'none';
        }

    } catch (error) {
        console.error('加载故事列表失败:', error);
        document.getElementById('storiesContainer').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>加载失败</h4>
                    <p>无法连接到服务器，请检查网络连接。</p>
                </div>
            `;
    }
}

// 显示故事列表
function displayStories(stories) {
    if (!stories || stories.length === 0) {
        document.getElementById('storiesContainer').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h4>暂无相关故事</h4>
                    <p>${keyword ? `没有找到与 "${keyword}" 相关的故事，请尝试其他关键词。` : '管理员正在整理红色故事，敬请期待...'}</p>
                    <button onclick="clearSearch()" class="btn btn-danger mt-3">
                        <i class="fas fa-redo me-2"></i>查看全部故事
                    </button>
                </div>
            `;
        return;
    }

    let html = '<div class="story-grid">';

    stories.forEach(story => {
        const storyDate = new Date(story.createdAt).toISOString().split('T')[0];

        html += `
                <div class="story-card">
                    <div class="story-image">
                        <img src="${story.imageUrl || 'https://placehold.co/600x400/8B0000/FFFFFF?text=红色故事'}" alt="${story.title}">
                    </div>
                    <div class="story-info">
                        <div class="story-meta">
                            ${story.heroName ? `
                                <span class="story-hero">
                                    <i class="fas fa-user-tie me-1"></i>
                                    <span>${story.heroName}</span>
                                </span>
                            ` : ''}
                            <span class="story-date">${storyDate}</span>
                        </div>
                        <h4 class="story-title">${story.title}</h4>
                        <p class="story-summary">${abbreviateText(story.summary || story.content, 150)}</p>
                        <div class="story-footer">
                            ${story.location ? `
                                <div class="story-location">
                                    <i class="fas fa-map-marker-alt me-1"></i>
                                    <span>${story.location}</span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="text-center mt-3">
                            <a href="../story/detail.html?id=${story.id}" class="read-more-btn">
                                  阅读详情 <i class="fas fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
    });

    html += '</div>';
    document.getElementById('storiesContainer').innerHTML = html;

    // 添加卡片悬停效果
    addCardHoverEffects();
}

// 显示分页
function displayPagination(totalPages) {
    let html = `
            <nav aria-label="故事分页">
                <ul class="pagination justify-content-center">
        `;

    // 上一页按钮
    html += `
            <li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="goToPage(0)">
                    <i class="fas fa-angle-double-left"></i>
                </a>
            </li>
            <li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="goToPage(${Math.max(0, currentPage - 1)})">
                    <i class="fas fa-angle-left"></i>
                </a>
            </li>
        `;

    // 页码按钮
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="goToPage(${i})">${i + 1}</a>
                </li>
            `;
    }

    // 下一页按钮
    html += `
            <li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="goToPage(${Math.min(totalPages - 1, currentPage + 1)})">
                    <i class="fas fa-angle-right"></i>
                </a>
            </li>
            <li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="goToPage(${totalPages - 1})">
                    <i class="fas fa-angle-double-right"></i>
                </a>
            </li>
        `;

    html += `
                </ul>
            </nav>
        `;

    document.getElementById('paginationContainer').innerHTML = html;
}

// 跳转到指定页面
function goToPage(page) {
    currentPage = page;
    loadStories(sortType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 通过标签搜索
function searchByTag(tag) {
    keyword = tag;
    document.getElementById('keyword').value = tag;
    currentPage = 0;
    document.getElementById('searchResult').innerHTML = '搜索结果：' + tag;
    loadStories(sortType);
}

// 清空搜索
function clearSearch() {
    keyword = '';
    document.getElementById('keyword').value = '';
    currentPage = 0;
    document.getElementById('searchResult').innerHTML = '';
    loadStories(sortType);
}

// 添加卡片悬停效果
function addCardHoverEffects() {
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// 文本截断函数
function abbreviateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}