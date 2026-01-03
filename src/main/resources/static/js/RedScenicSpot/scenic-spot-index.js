/**
 * 首页红色圣地推荐功能
 */

// 获取首页圣地推荐数据
async function loadHomeScenicSpots() {
    try {
        console.log('🔄 正在加载首页圣地推荐数据...');

        const response = await fetch('http://localhost:8080/scenicspots/api/home');

        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            const scenicSpots = result.data;
            console.log(`✅ 成功加载 ${scenicSpots.length} 个圣地推荐`);
            renderHomeScenicSpots(scenicSpots);
        } else {
            showHomeScenicSpotsError('加载圣地推荐失败: ' + result.message);
        }
    } catch (error) {
        console.error('❌ 加载圣地推荐失败:', error);
        showHomeScenicSpotsError('无法连接到服务器，请确保Spring Boot应用已启动');
    }
}

/**
 * 渲染首页圣地推荐
 */
function renderHomeScenicSpots(scenicSpots) {
    const container = document.getElementById('home-scenic-spots-container');
    if (!container) {
        console.error('❌ 找不到圣地推荐容器');
        return;
    }

    if (!scenicSpots || scenicSpots.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle me-2"></i>
                    暂无圣地推荐数据
                </div>
            </div>
        `;
        return;
    }

    // 只显示前3个作为推荐
    const spotsToShow = scenicSpots.slice(0, 3);

    let html = '';
    spotsToShow.forEach(spot => {
        // 处理图片URL
        let imageUrl = spot.imageUrl;
        if (!imageUrl || imageUrl === '') {
            imageUrl = 'https://placehold.co/400x300/8B0000/FFFFFF?text=红色圣地';
        } else if (!imageUrl.startsWith('http')) {
            // 处理相对路径
            if (imageUrl.startsWith('/')) {
                imageUrl = 'http://localhost:8080' + imageUrl;
            } else if (imageUrl.startsWith('images/')) {
                imageUrl = 'http://localhost:8080/' + imageUrl;
            }
        }

        // 截取描述文字
        const shortDescription = spot.description
            ? (spot.description.length > 100 ? spot.description.substring(0, 100) + '...' : spot.description)
            : '暂无描述';

        // 判断是否为江西圣地（用于显示徽章）
        const isJiangxi = spot.location && spot.location.includes('江西');
        const provinceBadge = isJiangxi ?
            '<span class="badge bg-success me-1"><i class="fas fa-map-marker-alt"></i> 江西</span>' :
            '<span class="badge bg-info me-1"><i class="fas fa-globe-asia"></i> 省外</span>';

        html += `
            <div class="col-md-4">
                <div class="card card-red h-100">
                    <div class="position-relative">
                        <img src="${imageUrl}" 
                             onerror="this.src='https://placehold.co/400x300/dc3545/ffffff?text=图片加载失败'"
                             class="card-img-top scenic-spot-img" 
                             alt="${escapeHtml(spot.name)}"
                             style="height: 250px; object-fit: cover;">
                        <span class="position-absolute top-0 start-0 m-2">
                            ${provinceBadge}
                        </span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title card-title-red">${escapeHtml(spot.name)}</h5>
                        <p class="card-text">
                            <i class="fas fa-map-marker-alt text-danger me-2"></i>
                            <span>${escapeHtml(spot.location || '未知地点')}</span>
                        </p>
                        <p class="card-text">${escapeHtml(shortDescription)}</p>
                        <a href="RedScenicSpot/detail.html?id=${spot.id}" class="btn btn-outline-red btn-sm w-100">
                            查看详情 <i class="fas fa-external-link-alt ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * 显示首页圣地错误
 */
function showHomeScenicSpotsError(message) {
    const container = document.getElementById('home-scenic-spots-container');
    if (!container) return;

    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
                <button onclick="loadHomeScenicSpots()" class="btn btn-sm btn-outline-danger mt-2 ms-2">重试</button>
            </div>
        </div>
    `;
}

/**
 * 转义HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏞️ 首页圣地推荐模块加载');

    // 检查是否在首页
    if (document.getElementById('home-scenic-spots-container')) {
        // 延迟加载，确保DOM完全加载
        setTimeout(() => {
            loadHomeScenicSpots();
        }, 500);
    }
});