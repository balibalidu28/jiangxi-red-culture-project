

// 前台通用：自动判断 API/静态资源的后端基址
window.API_ORIGIN = (location.port === '8080' || location.origin.includes('localhost:8080'))
    ? location.origin
    : 'http://localhost:8080';

window.apiUrl = function(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return window.API_ORIGIN + (path.startsWith('/') ? path : '/' + path);
};

window.assetUrl = function(path) {
    // 静态资源同样走后端 8080
    return window.apiUrl(path);
};
// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
// 从URL获取参数
    function getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            kw: urlParams.get('kw') || '',
            sort: urlParams.get('sort') || 'default',
            page: parseInt(urlParams.get('page') || '1'),
            size: 9
        };
    }

// 更新URL参数
    function updateUrl(params) {
        const urlParams = new URLSearchParams();
        if (params.kw) urlParams.set('kw', params.kw);
        if (params.sort !== 'default') urlParams.set('sort', params.sort);
        if (params.page > 1) urlParams.set('page', params.page);

        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.pushState({}, '', newUrl);
        return params;
    }

    // 加载英雄数据
    async function loadHeroes(params) {
        try {
            // 显示加载状态
            document.getElementById('heroes-container').innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-danger" role="status">
                        <span class="visually-hidden">加载中...</span>
                    </div>
                    <p class="mt-3">正在加载英雄数据...</p>
                </div>
            `;

            // 调用API获取数据
            const response = await fetch(window.apiUrl('/heroes/api'));
            if (!response.ok) throw new Error('网络响应不正常');

            const heroes = await response.json();

            // 搜索过滤
            let filteredHeroes = heroes;
            if (params.kw) {
                const kw = params.kw.toLowerCase();
                filteredHeroes = heroes.filter(hero =>
                    (hero.name && hero.name.toLowerCase().includes(kw)) ||
                    (hero.alias && hero.alias.toLowerCase().includes(kw)) ||
                    (hero.description && hero.description.toLowerCase().includes(kw))
                );
            }

            // 排序
            if (params.sort === 'name') {
                filteredHeroes.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            } else if (params.sort === 'time') {
                filteredHeroes.sort((a, b) => {
                    const dateA = a.birthDate ? new Date(a.birthDate) : new Date(0);
                    const dateB = b.birthDate ? new Date(b.birthDate) : new Date(0);
                    return dateA - dateB;
                });
            }

            // 分页
            const totalHeroes = filteredHeroes.length;
            const totalPages = Math.max(1, Math.ceil(totalHeroes / params.size));
            const currentPage = Math.min(Math.max(1, params.page), totalPages);
            const startIndex = (currentPage - 1) * params.size;
            const endIndex = Math.min(startIndex + params.size, totalHeroes);
            const pageHeroes = filteredHeroes.slice(startIndex, endIndex);

            // 更新显示
            document.getElementById('total-count').textContent = totalHeroes;
            document.getElementById('total-records').textContent = totalHeroes;
            document.getElementById('start-record').textContent = startIndex + 1;
            document.getElementById('end-record').textContent = endIndex;

            // 渲染英雄卡片
            renderHeroes(pageHeroes);

            // 渲染分页
            renderPagination(currentPage, totalPages, params);

            // 如果没有数据
            if (pageHeroes.length === 0) {
                document.getElementById('heroes-container').innerHTML = `
                    <div class="col-12">
                        <div class="no-results text-center py-5">
                            <i class="fas fa-search fa-3x text-muted mb-3"></i>
                            <h4 class="mb-3" style="color: #666;">${params.kw ? '未找到相关英雄' : '暂无英雄数据'}</h4>
                            <p class="text-muted mb-4">${params.kw ? '尝试使用不同的关键词搜索，或者浏览所有英雄' : '请先添加英雄数据'}</p>
                            ${params.kw ? `<button type="button" onclick="resetSearch()" class="btn btn-danger">
                                <i class="fas fa-users me-2"></i> 查看所有英雄
                            </button>` : ''}
                        </div>
                    </div>
                `;
            }

        } catch (error) {
            console.error('加载英雄数据失败:', error);
            document.getElementById('heroes-container').innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        加载英雄数据失败: ${error.message}
                    </div>
                </div>
            `;
        }
    }

    // 渲染英雄卡片
    function renderHeroes(heroes) {
        const container = document.getElementById('heroes-container');
        let html = '';

        heroes.forEach(hero => {
            const raw = (hero.imageUrl || '').trim();
            const imageUrl = raw ? window.assetUrl(raw) : '默认图(https://...)';

            const description = hero.description
                ? (hero.description.length > 100 ? hero.description.substring(0, 100) + '...' : hero.description)
                : '暂无简介';

            // 详情页链接 - 使用文件路径
            const detailUrl = `/jiangxi-red-culture-project/JXRedCultureDisplay/templates/hero/detail.html?id=${hero.id}`;

            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card hero-card h-100">
                        <div class="hero-image">
                            <img src="${imageUrl}"
                                 alt="${hero.name}"
                                 class="card-img-top">
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title mb-0" style="color: var(--red-primary);">${hero.name || '未命名'}</h5>
                                <span class="hero-badge">${hero.category || '革命英雄'}</span>
                            </div>
                            <p class="card-text text-muted small mb-2">
                                <i class="fas fa-user me-1"></i>
                                ${hero.gender || '男'}
                                <i class="fas fa-flag ms-2 me-1"></i>
                                ${hero.ethnicity || '汉族'}
                            </p>
                            <p class="card-text">${description}</p>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                    ${hero.birthplace ? `
                                        <span class="badge bg-light text-dark me-1">
                                            <i class="fas fa-map-marker-alt me-1"></i>${hero.birthplace}
                                        </span>
                                    ` : ''}
                                </div>
                                <a href="${detailUrl}" class="btn btn-outline-danger btn-sm">
                                    查看详情 <i class="fas fa-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // 渲染分页
    function renderPagination(currentPage, totalPages, params) {
        const pagination = document.getElementById('pagination');

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';

        // 上一页
        const prevDisabled = currentPage === 1 ? 'disabled' : '';
        html += `
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" data-page="${currentPage - 1}" ${prevDisabled ? 'tabindex="-1"' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // 页码
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const active = i === currentPage ? 'active' : '';
            html += `
                <li class="page-item ${active}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // 下一页
        const nextDisabled = currentPage === totalPages ? 'disabled' : '';
        html += `
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" data-page="${currentPage + 1}" ${nextDisabled ? 'tabindex="-1"' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        pagination.innerHTML = html;

        // 添加分页点击事件
        document.querySelectorAll('#pagination .page-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.getAttribute('data-page'));
                if (!isNaN(page)) {
                    const params = getUrlParams();
                    params.page = page;
                    updateUrl(params);
                    loadHeroes(params);
                }
            });
        });
    }

    // 重置搜索
    function resetSearch() {
        updateUrl({kw: '', sort: 'default', page: 1, size: 9});
        document.getElementById('keyword').value = '';
        document.getElementById('sort-select').value = 'default';
        loadHeroes(getUrlParams());
    }

    // 搜索按钮点击事件
    document.getElementById('search-btn').addEventListener('click', function() {
        const keyword = document.getElementById('keyword').value.trim();
        const sort = document.getElementById('sort-select').value;
        const params = {kw: keyword, sort: sort, page: 1, size: 9};
        updateUrl(params);
        loadHeroes(params);
    });

    // 重置按钮点击事件
    document.getElementById('reset-btn').addEventListener('click', resetSearch);

    // 排序选择变化事件
    document.getElementById('sort-select').addEventListener('change', function() {
        const params = getUrlParams();
        params.sort = this.value;
        params.page = 1;
        updateUrl(params);
        loadHeroes(params);
    });

    // 回车键搜索
    document.getElementById('keyword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('search-btn').click();
        }
    });

    // 监听浏览器前进后退
    window.addEventListener('popstate', function() {
        loadHeroes(getUrlParams());
    });

    // 初始加载
    const initialParams = getUrlParams();
    document.getElementById('keyword').value = initialParams.kw;
    document.getElementById('sort-select').value = initialParams.sort;
    loadHeroes(initialParams);
});