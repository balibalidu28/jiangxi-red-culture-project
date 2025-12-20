// 左侧导航栏模块切换
const navItems = document.querySelectorAll('.sidebar-nav li');
const sections = document.querySelectorAll('.module-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // 移除所有当前焦点的 active 状态
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // 显示对应模块内容区
        const targetId = item.getAttribute('data-target');
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });
    });
});
