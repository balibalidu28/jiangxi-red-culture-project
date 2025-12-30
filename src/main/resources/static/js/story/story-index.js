// home-story.js - 首页最新故事数据加载

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载首页最新故事
    loadHomeStories();
});

// 获取故事详情页的完整路径
function getStoryDetailUrl(storyId) {
    // 使用前端页面的本地路径
    return `http://localhost:63342/jiangxi-red-culture-project/JXRedCultureDisplay/templates/story/detail.html?id=${storyId}`;
}

// 获取资源URL（处理图片路径）
function getAssetUrl(path) {
    if (!path || path.trim() === '') {
        return 'https://placehold.co/600x400/8B0000/FFFFFF?text=红色故事';
    }

    // 如果是完整URL，直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // 如果是相对路径，需要拼接后端服务器的地址
    const baseUrl = 'http://localhost:8080';

    // 确保路径以斜杠开头
    if (!path.startsWith('/')) {
        path = '/' + path;
    }

    return baseUrl + path;
}

// 加载首页最新故事数据
async function loadHomeStories() {
    try {
        const container = document.getElementById('home-stories-container');
        if (!container) return;

        // 显示加载状态
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-danger" role="status">
                    <span class="visually-hidden">加载中...</span>
                </div>
                <p class="mt-3">正在加载最新故事...</p>
            </div>
        `;

        // 调用API获取最新故事 - 获取第一页的最新故事
        const apiUrl = 'http://localhost:8080/stories/api?page=0&size=6&kw=';
        console.log('正在请求故事API:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('故事API响应错误:', response.status, response.statusText);
            throw new Error(`网络响应不正常: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('故事API返回数据:', data);

        const stories = data.content || [];

        // 渲染最新故事
        renderHomeStories(stories);

    } catch (error) {
        console.error('加载首页故事数据失败:', error);
        // 加载失败时显示错误信息
        const container = document.getElementById('home-stories-container');
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        加载最新故事失败，请稍后重试
                        <br>
                        <small>错误信息: ${error.message}</small>
                    </div>
                </div>
            `;
        }
    }
}

// 渲染首页最新故事
function renderHomeStories(stories) {
    const container = document.getElementById('home-stories-container');

    if (!stories || stories.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    暂无最新故事，请稍后再来
                </div>
            </div>
        `;
        return;
    }

    console.log('渲染最新故事:', stories);
    let html = '';

    // 只显示前6个故事
    const displayStories = stories.slice(0, 6);

    displayStories.forEach(story => {
        // 处理故事数据
        const title = story.title || '无标题';
        const summary = story.summary || story.content || '暂无简介';
        const truncatedSummary = abbreviateText(summary, 120);

        // 获取图片URL
        const imageUrl = getAssetUrl(story.imageUrl);

        // 获取详情页URL
        const detailUrl = getStoryDetailUrl(story.id);

        // 格式化日期
        const storyDate = story.createdAt ? formatDate(story.createdAt) : '';
        const heroName = story.heroName || '';
        const location = story.location || '';

        html += `
            <div class="col-md-6">
                <div class="card card-red h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge badge-red">红色故事</span>
                            <small class="text-muted">${storyDate}</small>
                        </div>
                        <h5 class="card-title card-title-red mb-3">${title}</h5>
                        
                        <div class="story-meta mb-3">
                            ${heroName ? `
                                <span class="me-3">
                                    <i class="fas fa-user-tie me-1"></i>
                                    ${heroName}
                                </span>
                            ` : ''}
                            ${location ? `
                                <span>
                                    <i class="fas fa-map-marker-alt me-1"></i>
                                    ${location}
                                </span>
                            ` : ''}
                        </div>
                        
                        <p class="card-text mb-4">${truncatedSummary}</p>
                        
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <div>
                                ${story.heroName ? `
                                    <span class="badge bg-light text-dark">
                                        <i class="fas fa-user me-1"></i>${story.heroName}
                                    </span>
                                ` : ''}
                            </div>
                            <a href="${detailUrl}" class="btn btn-outline-red btn-sm">
                                阅读全文 <i class="fas fa-book-open ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    console.log('最新故事渲染完成');
}

// 工具函数：截断文本
function abbreviateText(text, maxLength) {
    if (!text || typeof text !== 'string') return '暂无简介';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// 工具函数：格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.error('日期格式化错误:', error);
        return dateString;
    }
}

// 检查API连接
async function checkStoryApiConnection() {
    try {
        const response = await fetch('http://localhost:8080/stories/api?page=0&size=1', { method: 'HEAD' });
        console.log('故事API连接状态:', response.ok ? '正常' : '异常');
        return response.ok;
    } catch (error) {
        console.error('故事API连接检查失败:', error);
        return false;
    }
}

// 重试机制
async function loadHomeStoriesWithRetry(retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            await loadHomeStories();
            return; // 成功则退出
        } catch (error) {
            console.error(`第${i + 1}次尝试失败:`, error);
            if (i < retries - 1) {
                console.log(`等待${delay}ms后重试...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // 指数退避
            }
        }
    }
    console.error('所有重试均失败');
}

// 添加故事卡片悬停效果
function addStoryCardHoverEffects() {
    setTimeout(() => {
        const storyCards = document.querySelectorAll('#home-stories-container .card');
        storyCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.transition = 'transform 0.3s ease';
                this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }, 100);
}

// 在渲染完成后添加悬停效果
const originalRenderHomeStories = renderHomeStories;
renderHomeStories = function(stories) {
    originalRenderHomeStories.call(this, stories);
    addStoryCardHoverEffects();
};