// hero-detail.js 文件
// 全局配置
window.API_BASE = 'http://localhost:8080';
window.STATIC_BASE = 'http://localhost:8080';

// 从URL获取英雄ID
function getHeroId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// ============ 新增：返回英雄列表功能 ============
function goBackToList() {
    // 直接跳转到英雄列表页
    window.location.href = '../hero/list.html';
}

// 格式化日期
function formatDate(dateString) {
    if (!dateString) return '不详';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '不详';

        // 如果是LocalDate格式（yyyy-MM-dd）
        if (dateString.includes('-')) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                return `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`;
            }
        }

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}年${month}月${day}日`;
    } catch (error) {
        console.error('日期格式化错误:', error, dateString);
        return '不详';
    }
}

// 构建完整的图片URL
function buildImageUrl(imagePath) {
    if (!imagePath) return window.STATIC_BASE + '/static/images/default-hero.jpg';

    // 如果已经是完整URL，直接返回
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // 如果以/开头，则认为是相对路径
    if (imagePath.startsWith('/')) {
        return window.STATIC_BASE + imagePath;
    }

    // 否则作为相对路径处理
    return window.STATIC_BASE + '/' + imagePath;
}

// 加载英雄数据
async function loadHeroData() {
    const heroId = getHeroId();

    if (!heroId) {
        document.getElementById('hero-name').textContent = '参数错误';
        document.getElementById('hero-description').textContent = '未指定英雄ID';
        return;
    }

    try {
        // 加载当前英雄数据
        const response = await fetch(`${window.API_BASE}/heroes/api/${heroId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('英雄不存在');
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const hero = await response.json();

        console.log('英雄数据:', hero); // 调试用

        // 更新页面标题
        document.title = `${hero.name || '英雄详情'} - 红色英雄 | 江西红色文化信息网`;
        document.getElementById('page-title').textContent = `${hero.name || '英雄详情'} - 红色英雄 | 江西红色文化信息网`;
        document.getElementById('breadcrumb-name').textContent = hero.name || '英雄详情';

        // 更新头部信息
        document.getElementById('hero-name').textContent = hero.name || '未命名英雄';
        document.getElementById('info-name').textContent = hero.name || '未命名英雄';

        if (hero.title) {
            document.getElementById('hero-title').textContent = hero.title;
        }

        if (hero.description) {
            document.getElementById('hero-description').textContent = hero.description;
        }

        // 更新图片
        const heroImage = document.getElementById('hero-image');
        if (hero.imageUrl && hero.imageUrl.trim() !== '') {
            heroImage.src = buildImageUrl(hero.imageUrl);
        } else {
            heroImage.src = window.STATIC_BASE + '/static/images/default-hero.jpg';
        }

        // 更新徽章
        const badgesContainer = document.getElementById('hero-badges');
        let badgesHtml = '';

        if (hero.category) {
            badgesHtml += `
                <span class="badge bg-danger fs-6 py-2 px-3">
                    <i class="fas fa-award me-1"></i> ${hero.category}
                </span>
            `;
        }

        if (hero.birthplace) {
            badgesHtml += `
                <span class="badge bg-light text-dark fs-6 py-2 px-3">
                    <i class="fas fa-map-marker-alt me-1"></i> ${hero.birthplace}
                </span>
            `;
        }

        if (hero.birthDate || hero.deathDate) {
            badgesHtml += `
                <span class="badge bg-light text-dark fs-6 py-2 px-3">
                    <i class="fas fa-calendar-alt me-1"></i>
                    ${formatDate(hero.birthDate)}
                    ${hero.deathDate ? ` - ${formatDate(hero.deathDate)}` : ''}
                </span>
            `;
        }

        badgesContainer.innerHTML = badgesHtml;

        // 更新基本信息
        document.getElementById('info-alias').textContent = hero.alias || '暂无';
        document.getElementById('info-gender').textContent = hero.gender || '男';
        document.getElementById('info-ethnicity').textContent = hero.ethnicity || '汉族';
        document.getElementById('info-birthdate').textContent = formatDate(hero.birthDate);
        document.getElementById('info-deathdate').textContent = formatDate(hero.deathDate);
        document.getElementById('info-birthplace').textContent = hero.birthplace || '暂无';
        document.getElementById('info-political-status').textContent = hero.politicalStatus || '暂无';

        // 更新英雄事迹
        const contentText = document.getElementById('hero-content-text');
        if (hero.content && hero.content.trim() !== '') {
            contentText.innerHTML = hero.content;
        } else {
            contentText.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    暂无详细事迹内容
                </div>
            `;
        }

        // 加载所有英雄数据用于导航和相关推荐
        const allResponse = await fetch(`${window.API_BASE}/heroes/api`);
        const allHeroes = await allResponse.json();

        // 找到当前英雄的索引
        let currentIndex = -1;
        for (let i = 0; i < allHeroes.length; i++) {
            if (allHeroes[i].id == heroId) {
                currentIndex = i;
                break;
            }
        }

        // ============ 修改：为返回按钮添加事件监听 ============
        const backToListBtn = document.querySelector('a.btn.btn-outline-danger[href="/heroes"]');
        if (backToListBtn) {
            // 移除默认的链接行为，改用JavaScript控制
            backToListBtn.href = 'javascript:void(0);';
            backToListBtn.addEventListener('click', goBackToList);
        }

        // 生成导航按钮
        const navButtons = document.getElementById('navigation-buttons');
        let navHtml = '';

        if (currentIndex > 0) {
            const prevHero = allHeroes[currentIndex - 1];
            navHtml += `
                <a href="../hero/detail.html?id=${prevHero.id}" class="btn btn-outline-danger me-2">
                    <i class="fas fa-chevron-left me-2"></i> 上一位英雄
                </a>
            `;
        }

        if (currentIndex < allHeroes.length - 1 && currentIndex !== -1) {
            const nextHero = allHeroes[currentIndex + 1];
            navHtml += `
                <a href="../hero/detail.html?id=${nextHero.id}" class="btn btn-outline-danger">
                    下一位英雄 <i class="fas fa-chevron-right ms-2"></i>
                </a>
            `;
        }

        navButtons.innerHTML = navHtml;

        // 加载相关英雄推荐（同一类别的其他英雄）
        loadRelatedHeroes(hero.category, hero.id, allHeroes);

    } catch (error) {
        console.error('加载英雄数据失败:', error);
        document.getElementById('hero-name').textContent = '加载失败';
        document.getElementById('hero-description').textContent = `加载英雄数据失败: ${error.message}`;

        document.getElementById('hero-content-text').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                加载英雄数据失败: ${error.message}
                <div class="mt-2">
                    <button onclick="goBackToList()" class="btn btn-sm btn-outline-danger">
                        <i class="fas fa-arrow-left me-1"></i> 返回英雄列表
                    </button>
                </div>
            </div>
        `;
    }
}

// 加载相关英雄
async function loadRelatedHeroes(category, currentId, allHeroes) {
    try {
        const relatedContainer = document.getElementById('related-heroes');

        // 如果没有类别或只有当前英雄，显示随机推荐
        let relatedHeroes = [];
        if (category) {
            // 过滤出同一类别的其他英雄
            relatedHeroes = allHeroes.filter(h =>
                h.category === category && h.id != currentId
            );
        }

        // 如果相关英雄不足，用其他英雄补充
        if (relatedHeroes.length < 3) {
            const otherHeroes = allHeroes.filter(h =>
                h.id != currentId && !relatedHeroes.some(rh => rh.id === h.id)
            );
            relatedHeroes = [...relatedHeroes, ...otherHeroes].slice(0, 3);
        } else {
            relatedHeroes = relatedHeroes.slice(0, 3);
        }

        if (relatedHeroes.length > 0) {
            let relatedHtml = '';
            relatedHeroes.forEach(hero => {
                relatedHtml += `
                    <div class="related-hero-item mb-3">
                        <a href="/jiangxi-red-culture-project/JXRedCultureDisplay/templates/hero/detail.html?id=${hero.id}" class="text-decoration-none">
                            <div class="d-flex align-items-center">
                                <div class="flex-shrink-0">
                                    <img src="${buildImageUrl(hero.imageUrl)}"
                                         alt="${hero.name}"
                                         class="rounded-circle"
                                         style="width: 50px; height: 50px; object-fit: cover;"
                                         onerror="this.src='${window.STATIC_BASE}/static/images/default-hero.jpg'">
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <h6 class="mb-0 text-dark">${hero.name || '未命名英雄'}</h6>
                                    <small class="text-muted">${hero.title || hero.category || '革命英雄'}</small>
                                </div>
                            </div>
                        </a>
                    </div>
                    `;
            });
            relatedContainer.innerHTML = relatedHtml;
        } else {
            relatedContainer.innerHTML = '<p class="text-muted text-center">暂无相关英雄推荐</p>';
        }
    } catch (error) {
        console.error('加载相关英雄失败:', error);
        document.getElementById('related-heroes').innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    加载相关英雄失败
                </div>
            `;
    }
}

// 分享功能
function shareWechat() {
    const pageUrl = window.location.href;
    navigator.clipboard.writeText(pageUrl)
        .then(() => alert('链接已复制到剪贴板，请打开微信分享'))
        .catch(() => alert('复制失败，请手动复制链接：' + pageUrl));
}

function shareWeibo() {
    const pageUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://service.weibo.com/share/share.php?url=${pageUrl}&title=${title}`, '_blank');
}

function shareQQ() {
    const pageUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${pageUrl}&title=${title}`, '_blank');
}

// 键盘快捷键支持
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // 避免在输入框中触发快捷键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch(e.key) {
            case 'Escape':
            case 'Backspace':
                goBackToList();
                break;
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadHeroData();
    setupKeyboardShortcuts();

    // 图片点击放大
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG' && e.target.closest('#hero-content-text')) {
            e.preventDefault();

            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-0">
                            <img src="${e.target.src}" class="img-fluid w-100">
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();

            modal.addEventListener('hidden.bs.modal', function() {
                document.body.removeChild(modal);
            });
        }
    });

    // ============ 新增：确保DOM加载完成后绑定事件 ============
    // 以防万一，再次确保返回按钮绑定事件
    setTimeout(() => {
        const backToListBtn = document.querySelector('a.btn.btn-outline-danger[href="/heroes"]');
        if (backToListBtn) {
            backToListBtn.href = 'javascript:void(0);';
            backToListBtn.addEventListener('click', goBackToList);
        }
    }, 100);
});

