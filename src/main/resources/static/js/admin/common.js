// 只声明一次
window.STATIC_ORIGIN = (location.port === '8080' || location.origin.includes('localhost:8080'))
    ? location.origin
    : 'http://localhost:8080';
window.assetUrl = function(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return window.STATIC_ORIGIN + (path.startsWith('/') ? path : '/' + path);
};
// 公共图片预览（所有模块都用同一套弹窗）
window.previewImage = function(imageUrl, imageName) {
    if (!imageUrl) return;
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('previewImage');
    const title = document.getElementById('previewTitle');
    if (img) { img.onerror = null; img.src = window.assetUrl(imageUrl); img.alt = imageName || '图片预览'; }
    if (title) title.textContent = imageName || '图片预览';
    if (modal) modal.classList.add('active');
    if (img) img.onerror = function() {
        window.closeImagePreview();
        alert('图片加载失败，请检查图片链接是否有效');
    };
};
window.closeImagePreview = function() {
    const modal = document.getElementById('imagePreviewModal');
    if (modal) modal.classList.remove('active');
};
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.closeImagePreview();
});