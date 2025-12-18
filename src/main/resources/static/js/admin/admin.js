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

// 示例功能：增删改
function createHero() {
    alert('新增英雄功能待完成');
}

function editHero(id) {
    alert('编辑英雄 ID: ' + id);
}

function deleteHero(id) {
    if (confirm('确定要删除该英雄？')) {
        alert('已成功删除英雄 ID: ' + id);
    }
}

function createStory() {
    alert('新增故事功能待完成');
}

function editStory(id) {
    alert('编辑故事 ID: ' + id);
}

function deleteStory(id) {
    if (confirm('确定要删除该故事？')) {
        alert('已成功删除故事 ID: ' + id);
    }
}

// 其他模块功能继续补充...