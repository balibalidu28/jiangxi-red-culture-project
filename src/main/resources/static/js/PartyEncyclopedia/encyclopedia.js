/**
 * 党史大百科页面JavaScript - 环境检测和自动跳转
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 1. 首先检测环境，如果是本地文件则跳转
    if (checkEnvironmentAndRedirect()) {
        // 2. 如果是在服务器环境，初始化页面功能
        initEncyclopediaPage();
    }
});

/**
 * 检测当前环境，如果是本地文件则跳转到服务器
 * @returns {boolean} true=服务器环境，false=需要跳转
 */
function checkEnvironmentAndRedirect() {
    // 情况1：本地文件（file://协议）
    if (window.location.protocol === 'file:') {
        console.log('📁 检测到本地文件环境，跳转到服务器...');
        redirectToServer();
        return false;
    }

    // 情况2：静态服务器（没有端口或端口不对）
    if (window.location.hostname === 'localhost' &&
        (window.location.port === '' || window.location.port === '63342')) {
        console.log('🌐 检测到静态服务器，跳转到Spring Boot服务器...');
        redirectToServer();
        return false;
    }

    // 情况3：直接访问HTML文件（没有Thymeleaf数据）
    const hasThymeleafData = document.querySelector('[th\\:text]') ||
        document.querySelector('[th\\:if]') ||
        document.querySelector('[th\\:each]');

    if (!hasThymeleafData && window.location.pathname.includes('.html')) {
        console.log('⚡ 检测到直接访问HTML文件，跳转到服务器...');
        redirectToServer();
        return false;
    }

    console.log('✅ 服务器环境检测通过，初始化页面功能');
    return true;
}

/**
 * 跳转到服务器地址
 */
function redirectToServer() {
    const serverUrl = 'http://localhost:8080/encyclopedia/list';

    // 显示友好的跳转提示
    showRedirectMessage(serverUrl);

    // 3秒后自动跳转
    setTimeout(() => {
        window.location.href = serverUrl;
    }, 3000);
}

/**
 * 显示跳转提示
 */
function showRedirectMessage(serverUrl) {
    // 清空页面内容，显示跳转提示
    document.body.innerHTML = `
        <div class="redirect-container">
            <div class="redirect-content">
                <div class="redirect-icon">
                    <i class="fas fa-sync-alt fa-spin"></i>
                </div>
                <h2>正在跳转到党史大百科...</h2>
                <p>检测到您正在访问本地文件，正在跳转到服务器版本</p>
                
                <div class="redirect-progress">
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" 
                             style="width: 100%"></div>
                    </div>
                </div>
                
                <div class="redirect-info">
                    <p><strong>目标地址：</strong></p>
                    <code class="server-url">${serverUrl}</code>
                    
                    <div class="mt-4">
                        <a href="${serverUrl}" class="btn btn-danger btn-lg">
                            <i class="fas fa-external-link-alt me-2"></i>立即跳转
                        </a>
                        <button onclick="location.reload()" class="btn btn-outline-secondary btn-lg ms-2">
                            <i class="fas fa-redo me-2"></i>重新检测
                        </button>
                    </div>
                    
                    <div class="mt-4 text-start">
                        <h5><i class="fas fa-info-circle me-2"></i>如果跳转失败：</h5>
                        <ul>
                            <li>确保Spring Boot应用已启动</li>
                            <li>检查端口8080是否被占用</li>
                            <li>或者修改端口号：在<code>application.properties</code>中设置<code>server.port=8081</code></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 添加样式
    addRedirectStyles();
}

/**
 * 添加跳转提示的样式
 */
function addRedirectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .redirect-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
        }
        
        .redirect-content {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
            text-align: center;
        }
        
        .redirect-icon {
            font-size: 48px;
            color: #d9534f;
            margin-bottom: 20px;
        }
        
        .redirect-progress {
            margin: 30px 0;
        }
        
        .server-url {
            display: inline-block;
            background: #f8f9fa;
            padding: 8px 15px;
            border-radius: 5px;
            color: #d9534f;
            font-weight: bold;
            margin: 10px 0;
            word-break: break-all;
        }
        
        .redirect-info {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 初始化党史大百科页面功能
 */
function initEncyclopediaPage() {
    console.log('🚀 初始化党史大百科页面功能');

    // 初始化搜索功能
    initSearchFunctionality();

    // 高亮当前选中的词条
    highlightCurrentItem();

    // 绑定键盘快捷键
    bindKeyboardShortcuts();
}

// 其他原有的功能函数保持不变...
// initSearchFunctionality, highlightCurrentItem等函数保持原样

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (!searchForm || !searchInput) return;

    // 表单提交处理
    searchForm.addEventListener('submit', function(e) {
        // 如果搜索框为空，阻止提交
        if (searchInput.value.trim() === '') {
            e.preventDefault();
            alert('请输入搜索关键词');
            searchInput.focus();
        }
    });

    // 实时搜索建议
    let timer;
    searchInput.addEventListener('input', function() {
        clearTimeout(timer);

        const keyword = this.value.trim();
        if (keyword.length >= 2) {
            timer = setTimeout(() => {
                fetchSearchSuggestions(keyword);
            }, 500);
        } else {
            hideSuggestions();
        }
    });

    // 点击页面其他地方隐藏建议框
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSuggestions();
        }
    });
}

/**
 * 获取搜索建议
 */
async function fetchSearchSuggestions(keyword) {
    try {
        const response = await fetch(`/encyclopedia/api/search?keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            showSearchSuggestions(data.data, keyword);
        } else {
            hideSuggestions();
        }
    } catch (error) {
        console.error('获取建议失败:', error);
    }
}

/**
 * 显示搜索建议
 */
function showSearchSuggestions(results, keyword) {
    let container = document.getElementById('searchSuggestions');
    if (!container) {
        container = document.createElement('div');
        container.id = 'searchSuggestions';
        container.className = 'search-suggestions';

        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.appendChild(container);
        }
    }

    let html = '<ul class="suggestions-list">';

    // 限制显示5条建议
    results.slice(0, 5).forEach(item => {
        const highlightedTitle = highlightText(item.title, keyword);
        html += `
            <li onclick="selectSearchSuggestion('${item.title.replace(/'/g, "\\'")}')">
                <div class="d-flex align-items-center">
                    <i class="fas fa-book me-2 text-muted"></i>
                    <div>${highlightedTitle}</div>
                </div>
            </li>
        `;
    });

    html += '</ul>';
    container.innerHTML = html;
    container.style.display = 'block';
}

/**
 * 选择搜索建议
 */
function selectSearchSuggestion(keyword) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = keyword;

        // 提交搜索表单
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.submit();
        }
    }

    hideSuggestions();
}

/**
 * 隐藏搜索建议
 */
function hideSuggestions() {
    const container = document.getElementById('searchSuggestions');
    if (container) {
        container.style.display = 'none';
    }
}

/**
 * 高亮当前选中的词条
 */
function highlightCurrentItem() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentId = urlParams.get('id');

    if (currentId) {
        // 移除所有active类
        document.querySelectorAll('.list-group-item').forEach(item => {
            item.classList.remove('active');
        });

        // 为当前词条添加active类
        const currentItem = document.querySelector(`a[href*="id=${currentId}"]`);
        if (currentItem) {
            currentItem.classList.add('active');

            // 滚动到可见区域
            setTimeout(() => {
                currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
}

/**
 * 绑定键盘快捷键
 */
function bindKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + F 聚焦搜索框
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // ESC 隐藏建议框
        if (e.key === 'Escape') {
            hideSuggestions();
        }
    });
}

/**
 * 高亮文本中的关键词
 */
function highlightText(text, keyword) {
    if (!text || !keyword) return escapeHtml(text);

    const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
    return escapeHtml(text).replace(regex, '<span class="highlight">$1</span>');
}

/**
 * 转义HTML
 */
function escapeHtml(text) {
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
 * AJAX加载词条详情
 */
async function loadEntryDetail(id) {
    try {
        const response = await fetch(`/encyclopedia/api/entry/${id}`);
        const data = await response.json();

        if (data.success) {
            displayEntryDetail(data.data);
        } else {
            alert('加载失败: ' + data.message);
        }
    } catch (error) {
        console.error('加载详情失败:', error);
        alert('网络错误，请稍后重试');
    }
}

/**
 * 显示词条详情（用于AJAX加载）
 */
function displayEntryDetail(entry) {
    const contentBox = document.querySelector('.content-box');
    if (!contentBox) return;

    let html = `
        <h1 class="display-5 fw-bold text-danger mb-4">${escapeHtml(entry.title)}</h1>
    `;

    if (entry.imageUrl) {
        html += `
            <div class="mb-4">
                <img src="${entry.imageUrl}" class="img-fluid rounded" alt="${escapeHtml(entry.title)}">
            </div>
        `;
    }

    html += `
        <div class="encyclopedia-content">
            ${entry.content.replace(/\n/g, '<br>')}
        </div>
        <div class="mt-4 pt-3 border-top">
            <button onclick="history.back()" class="btn btn-outline-danger">
                <i class="fas fa-arrow-left me-2"></i>返回
            </button>
        </div>
    `;

    contentBox.innerHTML = html;
}

/**
 * 复制当前URL（分享功能）
 */
function shareCurrentPage() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('页面链接已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
    });
}