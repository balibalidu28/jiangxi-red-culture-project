// 示例：为后续可扩展到AJAX加载等做准备
// 当前无动态功能，可添加比如点击英雄卡片弹窗详情等
document.querySelectorAll('.hero-card').forEach(card => {
    card.addEventListener('click', () => {
        alert('可以跳转到英雄详细页面，或弹窗详情');
    });
});