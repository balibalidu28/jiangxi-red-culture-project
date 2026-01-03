/* D:\zzm\JavaEE\ks\JX-RedCultureDisplay\src\main\resources\static\js\RedScenicSpot\detail.js */

/**
 * 红色圣地详情页JS - 在63342端口运行，通过AJAX调用8080端口
 */

// 页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('📖 红色圣地详情页启动（63342端口）');
    console.log('当前完整URL:', window.location.href);
    console.log('当前路径:', window.location.pathname);
    console.log('查询参数:', window.location.search);

    // 处理URL参数获取ID
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    console.log('详情页ID参数:', id);

    if (id) {
        // 加载并渲染详情
        loadSpotDetail(id).then(spot => {
            if (spot) {
                renderSpotDetail(spot);
                // 更新页面标题
                document.title = spot.name + ' - 圣地详情';
            } else {
                showDetailError('无法加载圣地详情');
            }
        }).catch(error => {
            console.error('加载详情失败:', error);
            showDetailError('加载失败: ' + error.message);
        });
    } else {
        console.warn('⚠️ 未找到ID参数');
        showDetailError('未指定圣地ID，请从列表页选择圣地');
    }
});

/**
 * 加载圣地详情
 */
async function loadSpotDetail(id) {
    try {
        console.log(`📖 正在从8080端口加载圣地详情: ${id}`);

        // 构建API URL
        const apiUrl = `http://localhost:8080/scenicspots/api/${id}`;
        console.log('API请求地址:', apiUrl);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('圣地不存在（404）');
            }
            throw new Error(`HTTP错误: ${response.status}`);
        }

        const result = await response.json();
        console.log('API响应结果:', result);

        if (result.success) {
            const spot = result.data;
            console.log(`✅ 加载详情成功: ${spot.name}`);
            console.log('圣地数据:', spot);
            return spot;
        } else {
            console.error('加载详情失败，服务器返回错误:', result.message);
            throw new Error(result.message || '服务器返回错误');
        }
    } catch (error) {
        console.error('❌ 加载详情失败:', error);
        throw error;
    }
}

/**
 * 渲染圣地详情
 */
function renderSpotDetail(spot) {
    const detailContainer = document.getElementById('detailContent');
    if (!detailContainer) {
        console.error('❌ 找不到详情容器');
        return;
    }

    console.log('正在渲染圣地详情:', spot.name);

    // 处理图片URL
    let imageUrl = spot.imageUrl;
    console.log('原始图片URL:', imageUrl);

    if (imageUrl) {
        if (!imageUrl.startsWith('http')) {
            if (imageUrl.startsWith('/')) {
                imageUrl = 'http://localhost:8080' + imageUrl;
            } else if (imageUrl.startsWith('images/')) {
                imageUrl = 'http://localhost:8080/' + imageUrl;
            } else {
                imageUrl = 'http://localhost:8080/images/' + imageUrl;
            }
        }
    }

    console.log('处理后的图片URL:', imageUrl);

    const detailHtml = `
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card border-0 shadow-sm detail-card">
                    <!-- 图片容器 - 居中显示 -->
                    <div class="detail-img-container">
                        <img src="${imageUrl || 'https://placehold.co/600x300/8B0000/FFFFFF?text=圣地图片'}"
                             class="detail-img"
                             alt="${escapeHtml(spot.name)}"
                             onerror="console.error('图片加载失败:', this.src); this.src='https://placehold.co/600x300/dc3545/ffffff?text=图片加载失败'">
                    </div>
                    
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4 detail-header">
                            <div>
                                <h1 class="fw-bold mb-2" id="spotTitle">${escapeHtml(spot.name)}</h1>
                                <span class="badge location-badge">
                                    <i class="fas fa-map-marker-alt me-1"></i>${escapeHtml(spot.location || '未知地区')}
                                </span>
                            </div>
                            <button onclick="goBackToList()" class="btn btn-outline-secondary back-btn">
                                <i class="fas fa-reply me-1"></i> 返回列表
                            </button>
                        </div>
                        
                        <!-- 历史介绍悬浮区域 -->
                        <div class="history-section">
                            <h5 class="fw-bold"><i class="fas fa-book-reader me-2"></i>历史介绍</h5>
                            <div class="detail-content">${formatContent(spot.description)}</div>
                        </div>
                        
                        <!-- 其他信息卡片 -->
                        ${spot.visitInfo ? `
                        <div class="info-card">
                            <h6><i class="fas fa-info-circle me-2"></i>参观信息</h6>
                            <div class="detail-content">${formatContent(spot.visitInfo)}</div>
                        </div>
                        ` : ''}
                        
                        ${spot.historicalSignificance ? `
                        <div class="info-card">
                            <h6><i class="fas fa-star me-2"></i>历史意义</h6>
                            <div class="detail-content">${formatContent(spot.historicalSignificance)}</div>
                        </div>
                        ` : ''}
                        
                        ${spot.relatedEvents ? `
                        <div class="info-card">
                            <h6><i class="fas fa-history me-2"></i>相关事件</h6>
                            <div class="detail-content">${formatContent(spot.relatedEvents)}</div>
                        </div>
                        ` : ''}
                        
                        
                    </div>
                    
                    <div class="card-footer text-center py-3">
                        江西红色文化信息网 · 传承革命精神
                    </div>
                </div>
            </div>
        </div>
    `;

    detailContainer.innerHTML = detailHtml;
    console.log('✅ 圣地详情渲染完成');
}
/**
 * 返回列表
 */
function goBackToList() {
    console.log('返回列表页');
    window.location.href = '../RedScenicSpot/list.html';
}

/**
 * 格式化内容（处理换行）
 */
function formatContent(content) {
    if (!content) return '<p class="text-muted fst-italic">暂无详细介绍</p>';
    return escapeHtml(content).replace(/\n/g, '<br>');
}

/**
 * 显示详情页错误信息
 */
function showDetailError(message) {
    console.error('显示错误信息:', message);
    const detailContent = document.getElementById('detailContent');
    if (detailContent) {
        detailContent.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body p-5 text-center">
                            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                            <h4 class="text-warning">页面错误</h4>
                            <p class="text-muted mb-4">${message}</p>
                            <div class="mt-4">
                                <button onclick="goBackToList()"
                                        class="btn btn-outline-danger me-2">
                                    <i class="fas fa-reply me-1"></i> 返回列表
                                </button>
                                <button onclick="location.reload()"
                                        class="btn btn-outline-secondary">
                                    <i class="fas fa-redo me-1"></i> 刷新页面
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
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