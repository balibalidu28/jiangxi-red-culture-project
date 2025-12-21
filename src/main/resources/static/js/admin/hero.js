// 显示新增英雄表单
function showHeroForm() {
    const formContainer = document.getElementById("heroFormContainer");
    formContainer.style.display = "block";
    document.getElementById("heroFormTitle").textContent = "新增英雄";
    document.getElementById("heroForm").reset();
    document.getElementById("heroId").value = ""; // 清空隐藏的ID
}

// 隐藏新增英雄表单
function hideHeroForm() {
    const formContainer = document.getElementById("heroFormContainer");
    formContainer.style.display = "none";
}

// 加载英雄列表
async function loadHeroes() {
    console.log("开始加载英雄列表...");

    const url = "http://localhost:8080/api/admin/heroes";
    console.log("请求URL:", url);

    try {
        // 添加超时设置
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

        const response = await fetch(url, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log("响应状态:", response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status} ${response.statusText}`);
        }

        const heroes = await response.json();
        console.log("获取到的英雄数据:", heroes);

        const heroTableBody = document.querySelector("#heroes table tbody");
        if (!heroTableBody) {
            console.error("找不到英雄表格tbody元素");
            return;
        }

        heroTableBody.innerHTML = ""; // 清空旧表格内容

        heroes.forEach(hero => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${hero.id}</td>
                <td>${hero.name || "未命名"}</td>
                <td>${hero.description ? (hero.description.length > 50 ? hero.description.substring(0, 50) + "..." : hero.description) : "暂无简介"}</td>
                <td>
                    <button onclick="editHero(${hero.id})">编辑</button>
                    <button onclick="deleteHero(${hero.id})">删除</button>
                </td>
            `;
            heroTableBody.appendChild(row);
        });

        console.log("英雄列表加载完成，共" + heroes.length + "条记录");
    } catch (error) {
        console.error("加载英雄列表失败:", error);
        console.error("错误名称:", error.name);
        console.error("错误消息:", error.message);

        if (error.name === 'AbortError') {
            alert("请求超时！请检查后端服务是否正常运行。");
        } else if (error.message.includes('Failed to fetch')) {
            alert("无法连接到服务器！请检查：\n1. 后端服务是否运行\n2. 网络连接\n3. CORS配置");
        } else {
            alert("加载英雄列表失败: " + error.message);
        }
    }
}

// 保存英雄信息（新增或编辑）
async function saveHero() {
    console.log("saveHero() 开始执行");

    const id = document.getElementById("heroId").value;
    const name = document.getElementById("hero-name").value;
    const location = document.getElementById("hero-location").value;
    const description = document.getElementById("hero-description").value;
    const imageFile = document.getElementById("hero-image").files[0];

    if (!name || !location) {
        alert("名称和地点为必填项！");
        return;
    }

    // 创建英雄数据对象
    const heroData = {
        name: name,
        location: location,
        description: description || "",
        // 注意：图片上传需要特殊处理，这里先处理文本数据
        // 如果需要图片上传，需要另外实现文件上传接口
    };

    console.log("要发送的数据:", heroData);

    try {
        // 判断是新增还是编辑
        const method = id ? "PUT" : "POST";
        const url = id ?
            `http://localhost:8080/api/admin/heroes/${id}` :
            "http://localhost:8080/api/admin/heroes";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(heroData)
        });

        console.log("响应状态:", response.status);

        if (response.ok) {
            const result = await response.json();
            console.log("保存成功:", result);
            alert(id ? "修改英雄成功！" : "新增英雄成功！");

            // 如果有图片文件，需要单独上传
            if (imageFile) {
                await uploadHeroImage(result.id, imageFile);
            }

            hideHeroForm();
            loadHeroes();
        } else {
            const errorText = await response.text();
            console.error("保存失败:", errorText);
            alert("保存失败: " + errorText);
        }
    } catch (error) {
        console.error("请求错误:", error);
        alert("网络错误，请重试");
    }
}

// 上传英雄图片（如果需要）
async function uploadHeroImage(heroId, imageFile) {
    console.log("开始上传英雄图片，英雄ID:", heroId);

    try {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("heroId", heroId);

        // 这里需要您的后端提供一个图片上传接口
        const response = await fetch(`http://localhost:8080/api/admin/heroes/${heroId}/image`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            console.log("图片上传成功");
        } else {
            console.warn("图片上传失败，但英雄数据已保存");
        }
    } catch (error) {
        console.error("图片上传过程中出错:", error);
        // 不阻断主要流程，只记录错误
    }
}

// 编辑英雄
async function editHero(id) {
    console.log("开始编辑英雄，ID:", id);

    try {
        // 获取英雄详情
        const response = await fetch(`http://localhost:8080/api/admin/heroes`);
        if (!response.ok) {
            throw new Error(`获取英雄列表失败: ${response.status}`);
        }

        const heroes = await response.json();
        // 从列表中查找对应ID的英雄
        const hero = heroes.find(h => h.id === id);

        if (!hero) {
            throw new Error("未找到ID为 " + id + " 的英雄");
        }

        console.log("找到要编辑的英雄:", hero);

        // 填充表单
        document.getElementById("heroId").value = hero.id;
        document.getElementById("hero-name").value = hero.name || "";
        document.getElementById("hero-location").value = hero.location || "";
        document.getElementById("hero-description").value = hero.description || "";

        // 注意：图片字段需要特殊处理，这里只是文本字段

        // 显示表单并修改标题
        const formContainer = document.getElementById("heroFormContainer");
        formContainer.style.display = "block";
        document.getElementById("heroFormTitle").textContent = "编辑英雄";

        // 修改提交按钮文本
        const submitBtn = document.querySelector("#heroForm button[type='button'][onclick='saveHero()']");
        if (submitBtn) {
            submitBtn.textContent = "更新";
        }

        console.log("表单已填充，准备编辑");
    } catch (error) {
        console.error("编辑英雄失败:", error);
        alert("加载英雄详情失败: " + error.message);
    }
}

// 删除英雄
async function deleteHero(id) {
    console.log("尝试删除英雄，ID:", id);

    if (!confirm("确定要删除这个英雄吗？此操作不可撤销！")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/admin/heroes/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log("删除成功");
            alert("删除英雄成功！");
            loadHeroes(); // 刷新列表
        } else {
            const errorText = await response.text();
            console.error("删除失败:", response.status, errorText);
            alert("删除失败: " + errorText);
        }
    } catch (error) {
        console.error("删除英雄过程中发生错误:", error);
        alert("删除失败: " + error.message);
    }
}

// 搜索英雄（如果需要）
function searchHero() {
    const searchTerm = document.getElementById("heroSearch").value.toLowerCase();
    const rows = document.querySelectorAll("#heroes table tbody tr");

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const description = row.cells[2].textContent.toLowerCase();

        if (name.includes(searchTerm) || description.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// 页面加载初始化
document.addEventListener("DOMContentLoaded", function() {
    // 当英雄管理模块激活时加载数据
    const heroSection = document.getElementById("heroes");
    if (heroSection && heroSection.classList.contains("active")) {
        loadHeroes();
    }

    // 监听模块切换
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === "class") {
                const heroSection = document.getElementById("heroes");
                if (heroSection && heroSection.classList.contains("active")) {
                    loadHeroes();
                }
            }
        });
    });

    // 开始观察heroes模块的class变化
    if (heroSection) {
        observer.observe(heroSection, { attributes: true });
    }

    // 绑定表单提交事件（使用事件委托）
    document.addEventListener("click", function(e) {
        if (e.target && e.target.type === "button" &&
            e.target.textContent === "保存" &&
            e.target.closest("#heroForm")) {
            e.preventDefault();
            saveHero();
        }
    });

    // 绑定取消按钮事件
    const cancelBtn = document.getElementById("heroForm")?.querySelector("button[type='button'][onclick='hideHeroForm()']");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", hideHeroForm);
    }
});

// 导出函数供HTML调用
window.showHeroForm = showHeroForm;
window.hideHeroForm = hideHeroForm;
window.saveHero = saveHero;
window.editHero = editHero;
window.deleteHero = deleteHero;
window.searchHero = searchHero;
window.loadHeroes = loadHeroes;