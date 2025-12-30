/**
 * 党史大百科静态版 - 在63342端口运行，通过AJAX调用8080端口
 */

// 全局变量
let currentEntryId = null;
let currentKeyword = null;
let allEntries = [];
let searchResults = [];

// 页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('📖 党史大百科静态版启动（63342端口）');
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

    // 2. 加载所有词条
    loadAllEntries();

    // 3. 绑定搜索事件
    bindSearchEvent();

    // 4. 监听URL变化
    window.addEventListener('popstate', function() {
        handleUrlParams();
    });
}

/**
 * 显示加载状态
 */
function showLoadingState() {
    const listContainer = document.getElementById('encyclopediaList');
    if (listContainer) {
        listContainer.innerHTML = `
            <div class="p-4 text-center">
                <div class="spinner-border text-danger" role="status">
                    <span class="visually-hidden">加载中...</span>
                </div>
                <p class="mt-2 text-muted">正在加载词条列表...</p>
            </div>
        `;
    }

    // 确保显示欢迎页
    document.getElementById('welcomeContent').style.display = 'block';
    document.getElementById('searchResultContent').style.display = 'none';
    document.getElementById('detailContent').style.display = 'none';
}

/**
 * 绑定搜索事件
 */
function bindSearchEvent() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                const keyword = searchInput.value.trim();
                if (keyword) {
                    searchEntries(keyword);
                    // 更新URL（不刷新页面）
                    updateUrlParams({ kw: keyword });
                }
            }
        });
    }
}

/**
 * 处理URL参数
 */
function handleUrlParams() {
    // 先从URL中获取参数
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const kw = urlParams.get('kw');

    console.log('📋 URL参数:', { id, kw });

    // 设置当前参数
    currentEntryId = id;
    currentKeyword = kw;

    // 如果有搜索关键词，更新搜索框
    if (kw) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = kw;
        }
    }

    // 如果是直接打开页面，可能需要从hash中获取参数
    if (!id && !kw && window.location.hash) {
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        const hashId = hashParams.get('id');
        const hashKw = hashParams.get('kw');

        if (hashId || hashKw) {
            console.log('🔍 从hash中获取参数:', { hashId, hashKw });
            currentEntryId = hashId;
            currentKeyword = hashKw;
        }
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
    if (params.id || params.kw) {
        const hashParams = new URLSearchParams();
        if (params.id) hashParams.set('id', params.id);
        if (params.kw) hashParams.set('kw', params.kw);
        hash = '#' + hashParams.toString();
    }

    // 更新hash（不会刷新页面）
    window.location.hash = hash;
}

/**
 * 加载所有词条
 */
async function loadAllEntries() {
    try {
        console.log('🔄 正在从8080端口加载词条...');

        // 从8080端口获取数据
        const response = await fetch('http://localhost:8080/encyclopedia/api/entries');

        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }

        const result = await response.json();
        console.log('📊 API响应:', result);

        if (result.success) {
            allEntries = result.data;
            console.log(`✅ 成功加载 ${allEntries.length} 个词条`);

            // 渲染列表
            renderEntryList(allEntries);

            // 检查是否需要显示详情
            if (currentEntryId) {
                // 有ID参数，加载详情
                await loadEntryDetail(currentEntryId);
            } else if (currentKeyword) {
                // 有关键词参数，执行搜索
                await searchEntries(currentKeyword);
            } else {
                // 无参数，显示欢迎页
                showWelcomePage();
            }
        } else {
            showError('加载词条列表失败: ' + result.message);
        }
    } catch (error) {
        console.error('❌ 加载词条失败:', error);
        showError('无法连接到服务器，请确保：<br>1. Spring Boot应用已启动（8080端口）<br>2. 没有跨域问题');
    }
}

/**
 * 搜索词条
 */
async function searchEntries(keyword) {
    currentKeyword = keyword;

    try {
        console.log(`🔍 正在搜索: ${keyword}`);

        const response = await fetch(`http://localhost:8080/encyclopedia/api/search?keyword=${encodeURIComponent(keyword)}`);

        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            searchResults = result.data;
            console.log(`✅ 搜索"${keyword}"找到 ${searchResults.length} 个结果`);

            // 渲染搜索结果
            renderEntryList(searchResults);

            // 显示搜索结果提示
            showSearchResultHint(keyword);

            // 检查是否需要显示详情
            if (currentEntryId) {
                await loadEntryDetail(currentEntryId);
            }
        } else {
            showError('搜索失败: ' + result.message);
        }
    } catch (error) {
        console.error('搜索失败:', error);
        showError('搜索失败，请检查网络连接');
    }
}

/**
 * 渲染词条列表
 */
function renderEntryList(entries) {
    const listContainer = document.getElementById('encyclopediaList');
    if (!listContainer) {
        console.error('❌ 找不到词条列表容器');
        return;
    }

    if (!entries || entries.length === 0) {
        listContainer.innerHTML = `
            <div class="p-4 text-center text-muted">
                <i class="fas fa-inbox fa-2x mb-3 opacity-25"></i>
                <p class="mb-0">暂无相关内容</p>
            </div>
        `;
        return;
    }

    let html = '';
    entries.forEach(entry => {
        const isActive = currentEntryId && currentEntryId == entry.id;
        html += `
            <a href="javascript:void(0)" 
               onclick="selectEntry(${entry.id})"
               class="list-group-item list-group-item-action encyclopedia-item ${isActive ? 'active' : ''}"
               data-id="${entry.id}">
                <i class="fas fa-book-open me-2 small ${isActive ? 'text-white' : 'text-muted'}"></i>
                <span>${escapeHtml(entry.title)}</span>
            </a>
        `;
    });

    listContainer.innerHTML = html;

    // 滚动到选中的词条
    if (currentEntryId) {
        setTimeout(() => {
            const activeItem = document.querySelector(`.encyclopedia-item[data-id="${currentEntryId}"]`);
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    }
}

/**
 * 选择词条
 */
async function selectEntry(id) {
    console.log(`📄 选择词条: ${id}`);
    currentEntryId = id;

    // 更新URL
    updateUrlParams({ id: id, kw: currentKeyword });

    // 高亮选中的词条
    document.querySelectorAll('.encyclopedia-item').forEach(item => {
        item.classList.remove('active');
        const icon = item.querySelector('i');
        if (icon) {
            icon.classList.remove('text-white');
            icon.classList.add('text-muted');
        }
    });

    const selectedItem = document.querySelector(`.encyclopedia-item[data-id="${id}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
        const icon = selectedItem.querySelector('i');
        if (icon) {
            icon.classList.remove('text-muted');
            icon.classList.add('text-white');
        }
    }

    // 加载详情
    await loadEntryDetail(id);
}

/**
 * 加载词条详情
 */
async function loadEntryDetail(id) {
    try {
        console.log(`📖 正在加载词条详情: ${id}`);

        const response = await fetch(`http://localhost:8080/encyclopedia/api/entry/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('词条不存在');
            }
            throw new Error(`HTTP错误: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            const entry = result.data;
            console.log(`✅ 加载详情成功: ${entry.title}`);
            renderEntryDetail(entry);
        } else {
            showError('加载详情失败: ' + result.message);
        }
    } catch (error) {
        console.error('加载详情失败:', error);
        showError('无法加载词条详情: ' + error.message);
    }
}

/**
 * 渲染词条详情
 */
function renderEntryDetail(entry) {
    const detailContainer = document.getElementById('detailContent');
    if (!detailContainer) {
        console.error('❌ 找不到详情容器');
        return;
    }

    // 处理图片URL - 处理跨端口问题
    let imageUrl = entry.imageUrl;
    if (imageUrl && !imageUrl.startsWith('http')) {
        // 如果是相对路径，需要转换为绝对路径
        if (imageUrl.startsWith('/')) {
            // 假设图片在8080端口的静态资源中
            imageUrl = 'http://localhost:8080' + imageUrl;
        } else if (imageUrl.startsWith('images/')) {
            imageUrl = 'http://localhost:8080/' + imageUrl;
        }
    }

    let imageHtml = '';
    if (imageUrl) {
        imageHtml = `
            <div class="mb-4 text-center">
                <img src="${imageUrl}" 
                     onerror="this.src='https://placehold.co/800x400/dc3545/ffffff?text=图片加载失败'"
                     class="img-fluid rounded shadow-sm encyclopedia-img" 
                     alt="${escapeHtml(entry.title)}">
                <p class="text-muted small mt-2">${escapeHtml(entry.title)}</p>
            </div>
        `;
    }

    detailContainer.innerHTML = `
        <h1 class="display-5 fw-bold mb-4 border-bottom pb-3 text-danger">${escapeHtml(entry.title)}</h1>
        ${imageHtml}
        <div class="encyclopedia-content">${formatContent(entry.content)}</div>
    `;

    showDetailPage();
}

/**
 * 格式化内容（处理换行）
 */
function formatContent(content) {
    if (!content) return '';
    return escapeHtml(content).replace(/\n/g, '<br>');
}

/**
 * 显示欢迎页
 */
function showWelcomePage() {
    document.getElementById('welcomeContent').style.display = 'block';
    document.getElementById('searchResultContent').style.display = 'none';
    document.getElementById('detailContent').style.display = 'none';
}

/**
 * 显示搜索结果提示
 */
function showSearchResultHint(keyword) {
    document.getElementById('welcomeContent').style.display = 'none';
    document.getElementById('searchResultContent').style.display = 'block';
    document.getElementById('detailContent').style.display = 'none';

    const keywordElement = document.getElementById('searchKeyword');
    if (keywordElement) {
        keywordElement.textContent = keyword;
    }
}

/**
 * 显示详情页
 */
function showDetailPage() {
    document.getElementById('welcomeContent').style.display = 'none';
    document.getElementById('searchResultContent').style.display = 'none';
    document.getElementById('detailContent').style.display = 'block';
}

/**
 * 显示错误信息
 */
function showError(message) {
    const listContainer = document.getElementById('encyclopediaList');
    if (listContainer) {
        listContainer.innerHTML = `
            <div class="p-4 text-center text-danger">
                <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                <p class="mb-0">${message}</p>
                <button onclick="location.reload()" class="btn btn-sm btn-outline-danger mt-2">刷新页面</button>
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

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 调试函数：查看图片是否可访问
 */
async function checkImageAccessibility(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}