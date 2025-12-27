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

        // 调用模块切换函数
        switchModule(targetId);
    });
});

// 模块切换函数（整合版）
function switchModule(moduleName) {
    console.log("切换到模块:", moduleName);

    // 隐藏所有模块
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 显示目标模块
    const targetSection = document.getElementById(moduleName);
    if (targetSection) {
        targetSection.classList.add('active');

        // 调用对应模块的加载函数
        switch(moduleName) {
            case 'heroes':
                console.log("调用 loadHeroes()");
                if (window.loadHeroes) {
                    window.loadHeroes();
                } else {
                    console.warn("loadHeroes 函数未定义");
                }
                break;
            case 'explore':
                console.log("调用 loadExplores()");
                if (window.loadExplores) {
                    window.loadExplores();
                } else {
                    console.warn("loadExplores 函数未定义");
                }
                break;
            case 'stories':
                console.log("调用 loadStories()");
                if (window.loadStories) {
                    window.loadStories();
                } else {
                    console.warn("loadStories 函数未定义");
                }
                break;
            case 'scenicspots':
                console.log("调用 loadScenicSpots()");
                if (window.loadScenicSpots) {
                    window.loadScenicSpots();
                } else {
                    console.warn("loadScenicSpots 函数未定义");
                }
                break;
            case 'encyclopedias':
                console.log("调用 loadEncyclopedias()");
                if (window.loadEncyclopedias) {
                    window.loadEncyclopedias();
                } else {
                    console.warn("loadEncyclopedias 函数未定义");
                }
                break;
            case 'user':
                console.log("调用 loadUsers()");
                if (window.loadUsers) {
                    window.loadUsers();
                } else {
                    console.warn("loadUsers 函数未定义");
                }
                break;
            default:
                console.log("未知模块:", moduleName);
        }
    }
}

// 页面加载时，如果某个模块是active状态，加载它
document.addEventListener("DOMContentLoaded", function() {
    console.log("admin.js: DOMContentLoaded");

    // 找到当前active的模块
    const activeSection = document.querySelector('.module-section.active');
    if (activeSection) {
        const moduleName = activeSection.id;
        console.log("当前active模块:", moduleName);

        // 延迟一点确保所有JS都加载完毕
        setTimeout(() => {
            switchModule(moduleName);
        }, 300);
    }
});

// 导出供其他模块调用
window.switchModule = switchModule;