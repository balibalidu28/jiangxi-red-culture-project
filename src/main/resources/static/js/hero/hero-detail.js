document.addEventListener('DOMContentLoaded', function() {
    // 分享功能
    const shareBtns = document.querySelectorAll('.share-btn');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList.contains('share-wechat') ? '微信' :
                this.classList.contains('share-weibo') ? '微博' : 'QQ';
            alert(`已复制链接到剪贴板，请到${platform}分享`);

            // 实际项目中这里应该复制页面链接到剪贴板
            const pageUrl = window.location.href;
            navigator.clipboard.writeText(pageUrl);
        });
    });

    // 图片点击放大
    const contentImages = document.querySelectorAll('.hero-content img');
    contentImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.innerHTML = `
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                            <div class="modal-body p-0">
                                <img src="${this.src}" class="img-fluid w-100">
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
        });
    });
});