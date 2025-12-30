
// home-hero.js - 首页英雄数据加载（适配你的API接口）

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载首页精选英雄
    loadHomeHeroes();
});

// 获取详情页的完整路径
function getDetailPageUrl(heroId) {
    // 使用前端页面的本地路径
    return `http://localhost:63342/jiangxi-red-culture-project/JXRedCultureDisplay/templates/hero/detail.html?id=${heroId}`;
}

// 获取资源URL（处理图片路径）
function getAssetUrl(path) {
    if (!path || path.trim() === '') {
        return 'https://placehold.co/400x300/8B0000/FFFFFF?text=英雄图片';
    }

    // 如果是完整URL，直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // 如果是相对路径，需要拼接后端服务器的地址
    // 你的图片上传路径是 /images/hero/filename.jpg
    // 后端服务器是 http://localhost:8080
    const baseUrl = 'http://localhost:8080';

    // 确保路径以斜杠开头
    if (!path.startsWith('/')) {
        path = '/' + path;
    }

    return baseUrl + path;
}

// 加载首页英雄数据
async function loadHomeHeroes() {
    try {
        const container = document.getElementById('home-heroes-container');
        if (!container) return;

        // 显示加载状态
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-danger" role="status">
                    <span class="visually-hidden">加载中...</span>
                </div>
                <p class="mt-3">正在加载英雄数据...</p>
            </div>
        `;

        // 调用API获取数据 - 使用你的后端API接口
        const apiUrl = 'http://localhost:8080/heroes/api';
        console.log('正在请求API:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('API响应错误:', response.status, response.statusText);
            throw new Error(`网络响应不正常: ${response.status} ${response.statusText}`);
        }

        const heroes = await response.json();
        console.log('API返回数据:', heroes);

        // 检查返回的数据格式
        if (!Array.isArray(heroes)) {
            console.error('API返回的不是数组:', heroes);
            throw new Error('API返回数据格式不正确');
        }

        // 选择4个英雄显示（可以根据需要调整筛选逻辑）
        const featuredHeroes = getFeaturedHeroes(heroes, 4);

        // 渲染英雄卡片
        renderHomeHeroes(featuredHeroes);

    } catch (error) {
        console.error('加载首页英雄数据失败:', error);
        // 加载失败时显示错误信息
        const container = document.getElementById('home-heroes-container');
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        加载英雄数据失败: ${error.message}
                        <br>
                        <small>请确保后端服务正在运行 (http://localhost:8080)</small>
                    </div>
                </div>
            `;
        }
    }
}

// 获取精选英雄（可以根据你的业务逻辑调整）
function getFeaturedHeroes(heroes, count = 4) {
    if (!heroes || !Array.isArray(heroes) || heroes.length === 0) {
        console.warn('英雄数据为空或格式不正确');
        return [];
    }

    console.log(`从${heroes.length}个英雄中筛选${count}个`);

    // 如果有推荐标记，优先选择
    const recommended = heroes.filter(h => {
        // 这里可以根据你的数据模型调整筛选条件
        // 例如: h.recommended === true 或 h.category === 'featured'
        return h.recommended === true ||
            h.featured === true ||
            (h.category && h.category.includes('推荐'));
    });

    if (recommended.length >= count) {
        console.log('使用推荐英雄:', recommended.slice(0, count));
        return recommended.slice(0, count);
    }

    // 如果没有足够的推荐英雄，随机选择
    console.log('没有足够的推荐英雄，使用随机选择');
    const shuffled = [...heroes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 渲染首页英雄卡片
function renderHomeHeroes(heroes) {
    const container = document.getElementById('home-heroes-container');

    if (!heroes || heroes.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    暂无英雄数据，请先添加英雄信息
                </div>
            </div>
        `;
        return;
    }

    console.log('渲染英雄卡片:', heroes);
    let html = '';

    heroes.forEach((hero, index) => {
        // 处理英雄数据
        const name = hero.name || '未命名';
        const description = hero.description ?
            (hero.description.length > 80 ? hero.description.substring(0, 80) + '...' : hero.description) :
            '暂无简介';

        // 获取图片URL
        const imageUrl = getAssetUrl(hero.imageUrl);

        // 获取详情页URL
        const detailUrl = getDetailPageUrl(hero.id);

        // 显示其他信息（可选）
        const gender = hero.gender || '男';
        const birthplace = hero.birthplace || '暂无';
        const title = hero.title || '革命英雄';

        html += `
            <div class="col-md-4 col-lg-3">
                <div class="card card-red h-100">
                    <div class="hero-image">
                        <img src="${imageUrl}"
                             alt="${name}"
                             class="card-img-top"
                             style="height: 200px; object-fit: cover;"
                             onerror="this.onerror=null;this.src='https://placehold.co/400x300/8B0000/FFFFFF?text=英雄图片'">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title card-title-red mb-2">${name}</h5>
                        <div class="small text-muted mb-2">
                            <i class="fas fa-user me-1"></i> ${gender}
                            ${birthplace !== '暂无' ? `<i class="fas fa-map-marker-alt ms-2 me-1"></i> ${birthplace}` : ''}
                        </div>
                        <p class="card-text mb-3 flex-grow-1">${description}</p>
                        <div class="mt-auto">
                            <a href="${detailUrl}" class="btn btn-outline-red btn-sm w-100">
                                了解更多 <i class="fas fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    console.log('英雄卡片渲染完成');
}

// 工具函数：安全的HTML转义（防止XSS）
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 调试函数：检查网络连接
async function checkApiConnection() {
    try {
        const response = await fetch('http://localhost:8080/heroes/api', { method: 'HEAD' });
        console.log('API连接状态:', response.ok ? '正常' : '异常');
        return response.ok;
    } catch (error) {
        console.error('API连接检查失败:', error);
        return false;
    }
}

// 可选：添加重试机制
async function loadHomeHeroesWithRetry(retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            await loadHomeHeroes();
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
