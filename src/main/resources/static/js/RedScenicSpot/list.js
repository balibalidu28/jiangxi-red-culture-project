/* D:\zzm\JavaEE\ks\JX-RedCultureDisplay\src\main\resources\static\js\RedScenicSpot\list.js */

/**
 * 红色圣地列表页JS - 增强版（支持搜索、省内省外筛选、分页显示）
 */

// 全局变量
let currentSpotId = null;
let currentLocation = null;
let currentProvince = 'all'; // 当前省份筛选：all/jiangxi/other
let currentKeyword = ''; // 当前搜索关键词
let allSpots = []; // 所有圣地数据
let filteredSpots = []; // 经过筛选后的数据
let displayedSpots = []; // 当前显示的数据
let currentPage = 1; // 当前页码
const SPOTS_PER_PAGE = 6; // 每页显示数量

// 页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('🗺️ 红色圣地列表页启动（63342端口）');
    console.log('当前URL:', window.location.href);

    // 强制显示加载中状态
    showLoadingState();

    // 延迟一点执行，确保DOM完全加载
    setTimeout(() => {
        initPage();
    }, 100);
});

/**
 * 初始化页面
 */
function initPage() {
    // 1. 处理URL参数
    handleUrlParams();

    // 2. 加载所有圣地
    loadAllSpots();

    // 3. 绑定筛选事件
    bindFilterEvents();

    // 4. 绑定搜索事件
    bindSearchEvents();

    // 5. 绑定显示更多事件
    bindLoadMoreEvents();

    // 6. 监听URL变化
    window.addEventListener('popstate', function() {
        handleUrlParams();
    });
}

/**
 * 显示加载状态
 */
function showLoadingState() {
    const listContainer = document.getElementById('spotListContainer');
    if (listContainer) {
        listContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-danger" role="status">
                    <span class="visually-hidden">加载中...</span>
                </div>
                <p class="mt-2 text-muted">正在加载圣地列表...</p>
            </div>
        `;
    }
}

/**
 * 绑定搜索事件
 */
function bindSearchEvents() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
}

/**
 * 处理搜索
 */
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        currentKeyword = searchInput.value.trim();
        currentPage = 1;

        // 清空地点筛选
        currentLocation = null;

        // 清空筛选按钮状态
        document.querySelectorAll('.city-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });

        applyFilters();
    }
}

/**
 * 绑定显示更多事件
 */
function bindLoadMoreEvents() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreSpots);
    }
}

/**
 * 绑定筛选事件
 */
function bindFilterEvents() {
    console.log('绑定筛选事件...');

    // 绑定一级筛选标签点击事件（全部/江西/省外）
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const province = this.getAttribute('data-filter');
            console.log('一级筛选点击，省份:', province, '当前省份:', currentProvince);

            if (province !== currentProvince) {
                currentProvince = province;
                currentPage = 1;
                currentLocation = null; // 切换省份时清空地点筛选
                currentKeyword = ''; // 清空搜索关键词

                // 清空搜索框
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.value = '';

                // 清空所有城市按钮的激活状态
                document.querySelectorAll('.city-btn.active').forEach(btn => {
                    btn.classList.remove('active');
                });

                // 更新按钮激活状态
                document.querySelectorAll('[data-filter]').forEach(b => {
                    b.classList.remove('active');
                    b.classList.add('btn-outline-danger');
                    b.classList.remove('btn-danger');
                });
                this.classList.remove('btn-outline-danger');
                this.classList.add('btn-danger');
                this.classList.add('active');

                // 显示对应的筛选面板
                document.querySelectorAll('.filter-pane').forEach(pane => {
                    pane.style.display = 'none';
                    pane.classList.remove('active');
                });

                const targetPane = document.getElementById(`filter-${province}`);
                console.log('目标面板:', `filter-${province}`, targetPane);

                if (targetPane) {
                    targetPane.style.display = 'block';
                    targetPane.classList.add('active');
                }

                // 立即应用筛选
                console.log('应用筛选，当前省份:', currentProvince);
                applyFilters();
            }
        });
    });

    // 绑定城市/省份按钮点击事件
    document.addEventListener('click', function(e) {
        const cityBtn = e.target.closest('.city-btn');
        if (cityBtn) {
            e.preventDefault();

            const location = cityBtn.getAttribute('data-loc');
            const province = cityBtn.getAttribute('data-province');

            console.log('城市按钮点击:', { location, province });

            // 清空搜索关键词
            currentKeyword = '';
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';

            // 设置筛选条件
            if (province) {
                // 省份筛选
                currentLocation = province;
            } else if (location) {
                // 具体地点筛选
                currentLocation = location;
            }

            // 清空所有城市按钮的激活状态（在当前面板内）
            const currentPane = cityBtn.closest('.filter-pane');
            if (currentPane) {
                currentPane.querySelectorAll('.city-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
            }

            // 设置当前按钮激活
            cityBtn.classList.add('active');

            currentPage = 1;
            console.log('应用筛选，条件:', { currentLocation, currentProvince });
            applyFilters();
        }
    });
}

/**
 * 判断圣地是否属于江西
 */
function isJiangxiSpot(spot) {
    if (!spot.location) return false;
    const location = spot.location.toLowerCase();
    const isJiangxi = location.includes('江西') ||
        location.includes('南昌') ||
        location.includes('井冈山') ||
        location.includes('瑞金') ||
        location.includes('于都') ||
        location.includes('萍乡') ||
        location.includes('上饶') ||
        location.includes('兴国') ||
        location.includes('弋阳') ||
        location.includes('景德镇') ||
        location.includes('吉安') ||
        location.includes('九江') ||
        location.includes('抚州') ||
        location.includes('赣州') ||
        location.includes('宜春') ||
        location.includes('新余') ||
        location.includes('鹰潭');

    console.log('判断是否江西圣地:', spot.name, spot.location, '结果:', isJiangxi);
    return isJiangxi;
}

/**
 * 应用所有筛选条件
 */
function applyFilters() {
    console.log('应用筛选条件:', {
        currentProvince,
        currentLocation,
        currentKeyword,
        totalSpots: allSpots.length
    });

    // 1. 先按关键词筛选
    let tempSpots = allSpots;

    if (currentKeyword) {
        const keyword = currentKeyword.toLowerCase();
        tempSpots = tempSpots.filter(spot => {
            const name = spot.name ? spot.name.toLowerCase() : '';
            const location = spot.location ? spot.location.toLowerCase() : '';
            return name.includes(keyword) || location.includes(keyword);
        });
        console.log('关键词筛选后数量:', tempSpots.length);
    }

    // 2. 按省份筛选
    if (currentProvince !== 'all') {
        tempSpots = tempSpots.filter(spot => {
            const isJiangxi = isJiangxiSpot(spot);
            const result = currentProvince === 'jiangxi' ? isJiangxi : !isJiangxi;
            console.log('省份筛选:', spot.name, '江西?', isJiangxi, '保留?', result);
            return result;
        });
        console.log('省份筛选后数量:', tempSpots.length);
    }

    // 3. 按地点筛选
    if (currentLocation) {
        const locationFilter = currentLocation.toLowerCase();
        tempSpots = tempSpots.filter(spot => {
            const location = spot.location ? spot.location.toLowerCase() : '';
            return location.includes(locationFilter);
        });
        console.log('地点筛选后数量:', tempSpots.length);
    }

    filteredSpots = tempSpots;
    console.log('最终筛选结果数量:', filteredSpots.length);
    renderSpotList();
}

/**
 * 加载更多圣地
 */
function loadMoreSpots() {
    // 显示加载状态
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadingMore = document.getElementById('loadingMore');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    if (loadingMore) loadingMore.style.display = 'block';

    // 模拟加载延迟
    setTimeout(() => {
        currentPage++;
        renderSpotList();

        // 恢复按钮状态
        if (loadMoreBtn) loadMoreBtn.style.display = 'block';
        if (loadingMore) loadingMore.style.display = 'none';

        // 滚动到新加载的内容附近
        const newCards = document.querySelectorAll('.col-md-6.col-lg-4');
        if (newCards.length > 0) {
            const lastCard = newCards[newCards.length - 1];
            lastCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 500);
}

/**
 * 渲染圣地列表
 */
function renderSpotList() {
    const listContainer = document.getElementById('spotListContainer');
    if (!listContainer) {
        console.error('❌ 找不到圣地列表容器');
        return;
    }

    // 计算要显示的圣地
    const totalSpots = filteredSpots.length;
    const spotsToDisplay = filteredSpots.slice(0, currentPage * SPOTS_PER_PAGE);
    displayedSpots = spotsToDisplay;

    // 更新结果计数
    updateResultsCount(totalSpots);

    if (totalSpots === 0) {
        listContainer.innerHTML = `
            <div class="col-12 text-center py-5 empty-state">
                <i class="fas fa-map-marked-alt fa-4x text-muted mb-3"></i>
                <h4 class="text-secondary">暂无相关内容</h4>
                <p class="text-muted">未找到符合条件的圣地</p>
                <button onclick="resetFilters()" class="btn btn-outline-danger mt-2">
                    <i class="fas fa-reply me-1"></i> 重置筛选
                </button>
            </div>
        `;
        hideLoadMoreSection();
        return;
    }

    // 渲染圣地卡片
    let html = '';
    spotsToDisplay.forEach(spot => {
        const description = spot.description ? escapeHtml(spot.description).substring(0, 80) + '...' : '暂无描述';
        const isJiangxi = isJiangxiSpot(spot);
        const provinceBadge = isJiangxi ?
            '<span class="badge bg-success me-1"><i class="fas fa-map-marker-alt"></i> 江西</span>' :
            '<span class="badge bg-info me-1"><i class="fas fa-globe-asia"></i> 省外</span>';

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm card-red hover-shadow">
                    <div class="position-relative">
                        <img src="${spot.imageUrl || 'https://placehold.co/600x400/8B0000/FFFFFF?text=暂无图片'}"
                             class="card-img-top" 
                             style="height: 200px; object-fit: cover;"
                             alt="${escapeHtml(spot.name)}"
                             onerror="this.src='https://placehold.co/600x400/dc3545/ffffff?text=图片加载失败'">
                        <span class="position-absolute top-0 start-0 m-2">
                            ${provinceBadge}
                        </span>
                        <span class="position-absolute top-0 end-0 m-2 badge bg-danger shadow">
                            <i class="fas fa-map-marker-alt me-1"></i>${escapeHtml(spot.location || '未知地区')}
                        </span>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold text-danger">${escapeHtml(spot.name)}</h5>
                        <p class="card-text text-muted small flex-grow-1">${description}</p>
                        <div class="text-end mt-3">
                            <a href="../RedScenicSpot/detail.html?id=${spot.id}" 
                               class="btn btn-sm btn-outline-danger w-100">
                                走进圣地 <i class="fas fa-chevron-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;

    // 控制显示更多按钮
    if (spotsToDisplay.length < totalSpots) {
        showLoadMoreSection();
    } else {
        hideLoadMoreSection();
    }
}

/**
 * 重置筛选条件
 */
function resetFilters() {
    currentProvince = 'all';
    currentKeyword = '';
    currentLocation = null;
    currentPage = 1;

    // 重置搜索框
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    // 重置一级筛选按钮状态
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-outline-danger');
        if (btn.getAttribute('data-filter') === 'all') {
            btn.classList.add('active');
            btn.classList.remove('btn-outline-danger');
            btn.classList.add('btn-danger');
        }
    });

    // 重置城市按钮
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 显示全部筛选面板
    document.querySelectorAll('.filter-pane').forEach(pane => {
        pane.style.display = 'none';
        pane.classList.remove('active');
    });

    const allPane = document.getElementById('filter-all');
    if (allPane) {
        allPane.style.display = 'block';
        allPane.classList.add('active');
    }

    applyFilters();
}

/**
 * 更新结果计数
 */
function updateResultsCount(count) {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

/**
 * 显示加载更多区域
 */
function showLoadMoreSection() {
    const loadMoreSection = document.getElementById('loadMoreSection');
    const loadingMore = document.getElementById('loadingMore');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (loadMoreSection) loadMoreSection.style.display = 'block';
    if (loadingMore) loadingMore.style.display = 'none';
    if (loadMoreBtn) loadMoreBtn.style.display = 'block';
}

/**
 * 隐藏加载更多区域
 */
function hideLoadMoreSection() {
    const loadMoreSection = document.getElementById('loadMoreSection');
    if (loadMoreSection) {
        loadMoreSection.style.display = 'none';
    }
}

/**
 * 处理URL参数
 */
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const loc = urlParams.get('loc');

    console.log('📋 URL参数:', { id, loc });

    // 设置当前参数
    currentSpotId = id;
    if (loc) {
        currentLocation = loc;
    }
}

/**
 * 更新URL参数（处理跨端口跳转问题）
 */
function updateUrlParams(params) {
    // 对于63342端口，我们使用hash来避免刷新页面
    const url = new URL(window.location);

    // 构建hash参数
    let hash = '';
    if (params.id || params.loc) {
        const hashParams = new URLSearchParams();
        if (params.id) hashParams.set('id', params.id);
        if (params.loc) hashParams.set('loc', params.loc);
        hash = '#' + hashParams.toString();
    }

    // 更新hash（不会刷新页面）
    window.location.hash = hash;
}

/**
 * 更新激活的筛选按钮
 */
function updateActiveFilter(location) {
    // 移除所有激活状态
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 找到对应的按钮并激活
    document.querySelectorAll('.city-btn').forEach(btn => {
        const btnLoc = btn.getAttribute('data-loc') || btn.textContent;
        if (btnLoc === location) {
            btn.classList.add('active');
        }
    });
}

/**
 * 加载所有圣地
 */
async function loadAllSpots() {
    try {
        console.log('🔄 正在从8080端口加载圣地...');

        const response = await fetch('http://localhost:8080/scenicspots/api');

        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }

        const result = await response.json();
        console.log('📊 API响应:', result);

        if (result.success) {
            allSpots = result.data;
            console.log(`✅ 成功加载 ${allSpots.length} 个圣地`);

            // 应用初始筛选
            applyFilters();
        } else {
            showError('加载圣地列表失败: ' + result.message);
        }
    } catch (error) {
        console.error('❌ 加载圣地失败:', error);
        showError('无法连接到服务器，请确保：<br>1. Spring Boot应用已启动（8080端口）<br>2. 没有跨域问题');
    }
}

/**
 * 选择圣地（跳转到详情页）
 */
function selectSpot(id) {
    console.log(`📄 选择圣地: ${id}`);
    window.location.href = `../RedScenicSpot/detail.html?id=${id}`;
}

/**
 * 显示错误信息
 */
function showError(message) {
    const listContainer = document.getElementById('spotListContainer');
    if (listContainer) {
        listContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="bg-white p-5 rounded shadow-sm">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h4 class="text-danger">加载失败</h4>
                    <p class="text-muted">${message}</p>
                    <button onclick="location.reload()" class="btn btn-outline-danger mt-2">
                        <i class="fas fa-redo me-1"></i> 刷新页面
                    </button>
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