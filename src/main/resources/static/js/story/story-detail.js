// 分享功能
function shareToWechat() {
    alert('请使用微信扫描二维码分享');
    // 实际开发中可以集成微信分享SDK
}

function shareToWeibo() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`http://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank');
}

function shareToQQ() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const summary = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');
    window.open(`http://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&summary=${summary}`, '_blank');
}

// 页面加载完成后的操作
document.addEventListener('DOMContentLoaded', function() {
    // 为相关故事卡片添加悬停效果
    const relatedCards = document.querySelectorAll('.related-story-card');
    relatedCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // 打印样式优化
    const printButton = document.querySelector('[onclick="window.print()"]');
    if (printButton) {
        printButton.addEventListener('click', function(e) {
            setTimeout(() => {
                // 添加打印时的特定样式
                const printStyle = document.createElement('style');
                printStyle.textContent = `
                            @media print {
                                nav, footer, .story-actions, .back-to-list, .hero-profile, .related-stories {
                                    display: none !important;
                                }
                                .container {
                                    max-width: 100% !important;
                                }
                                .story-content {
                                    font-size: 16px !important;
                                    line-height: 1.6 !important;
                                }
                            }
                        `;
                document.head.appendChild(printStyle);
            }, 100);
        });
    }

    // 平滑滚动
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// 添加复制链接功能
function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('链接已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
    });
}