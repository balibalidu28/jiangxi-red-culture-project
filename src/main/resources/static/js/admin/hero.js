// ============== 百科管理功能 ==============
async function loadEncyclopedias() {
    console.log("开始加载百科列表...");

    const url = "http://localhost:8080/api/admin/encyclopedias";
    console.log("请求URL:", url);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log("响应状态:", response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status} ${response.statusText}`);
        }

        const encyclopedias = await response.json();
        console.log("获取到的百科数据:", encyclopedias);

        const tableBody = document.querySelector("#encyclopediaTable tbody");
        if (!tableBody) {
            console.error("找不到表格tbody元素");
            return;
        }

        tableBody.innerHTML = ""; // 清空旧表格内容

        encyclopedias.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.content ? item.content.substring(0, 50) + '...' : "暂无内容"}</td>
                <td><img src="${item.imageUrl || '#'}" alt="百科图片" width="50"></td>
                <td>
                    <button onclick="editEncyclopedia(${item.id})">编辑</button>
                    <button onclick="deleteEncyclopedia(${item.id})">删除</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        console.log("百科列表加载完成，共" + encyclopedias.length + "条记录");
    } catch (error) {
        console.error("加载百科列表失败:", error);
        console.error("错误名称:", error.name);
        console.error("错误消息:", error.message);

        if (error.name === 'AbortError') {
            alert("请求超时！请检查后端服务是否正常运行。");
        } else if (error.message.includes('Failed to fetch')) {
            alert("无法连接到服务器！请检查：\n1. 后端服务是否运行\n2. 网络连接\n3. CORS配置");
        } else {
            alert("加载百科列表失败: " + error.message);
        }
    }
}

// 显示新增百科表单
function showEncyclopediaForm() {
    const formContainer = document.getElementById("encyclopediaFormContainer");
    formContainer.style.display = "block";
    document.getElementById("encyclopediaFormTitle").textContent = "新增百科";
    document.getElementById("encyclopediaForm").reset();
    document.getElementById("encyclopediaId").value = ""; // 清空隐藏的ID
}

// 隐藏新增百科表单
function hideEncyclopediaForm() {
    const formContainer = document.getElementById("encyclopediaFormContainer");
    formContainer.style.display = "none";
}

// 保存百科信息（新增或编辑）
async function saveEncyclopedia() {
    console.log("saveEncyclopedia() 开始执行");

    const id = document.getElementById("encyclopediaId").value;
    const title = document.getElementById("encyclopedia-title").value;
    const content = document.getElementById("encyclopedia-content").value;
    const imageUrl = document.getElementById("encyclopedia-image").value;

    if (!title || !content) {
        alert("标题和内容为必填项！");
        return;
    }

    const encyclopediaData = {
        title: title,
        content: content,
        imageUrl: imageUrl || ""
    };

    console.log("要发送的数据:", encyclopediaData);

    try {
        const method = id ? "PUT" : "POST";
        const url = id ?
            `http://localhost:8080/api/admin/encyclopedias/${id}` :
            "http://localhost:8080/api/admin/encyclopedias";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(encyclopediaData)
        });

        console.log("响应状态:", response.status);

        if (response.ok) {
            const result = await response.json();
            console.log("保存成功:", result);
            alert(id ? "修改百科成功！" : "新增百科成功！");
            hideEncyclopediaForm();
            loadEncyclopedias();
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

// 编辑百科功能
async function editEncyclopedia(id) {
    console.log("开始编辑百科，ID:", id);

    try {
        const response = await fetch(`http://localhost:8080/api/admin/encyclopedias/${id}`);
        if (!response.ok) {
            throw new Error(`获取百科详情失败: ${response.status}`);
        }

        const item = await response.json();
        console.log("找到要编辑的百科:", item);

        // 填充表单
        document.getElementById("encyclopediaId").value = item.id;
        document.getElementById("encyclopedia-title").value = item.title || "";
        document.getElementById("encyclopedia-content").value = item.content || "";
        document.getElementById("encyclopedia-image").value = item.imageUrl || "";

        // 显示表单
        const formContainer = document.getElementById("encyclopediaFormContainer");
        formContainer.style.display = "block";
        document.getElementById("encyclopediaFormTitle").textContent = "编辑百科";

        const submitBtn = document.querySelector("#encyclopediaForm button[type='submit']");
        if (submitBtn) {
            submitBtn.textContent = "更新";
        }

        console.log("表单已填充，准备编辑");
    } catch (error) {
        console.error("编辑百科失败:", error);
        alert("加载百科详情失败: " + error.message);
    }
}

// 删除百科功能
async function deleteEncyclopedia(id) {
    console.log("尝试删除百科，ID:", id);

    if (!confirm("确定要删除这个百科吗？此操作不可撤销！")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/admin/encyclopedias/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log("删除成功");
            alert("删除百科成功！");
            loadEncyclopedias();
        } else {
            const errorText = await response.text();
            console.error("删除失败:", response.status, errorText);
            alert("删除失败: " + errorText);
        }
    } catch (error) {
        console.error("删除百科过程中发生错误:", error);
        alert("删除失败: " + error.message);
    }
}

// 搜索百科功能
function searchEncyclopedia() {
    const searchTerm = document.getElementById("encyclopediaSearch").value.toLowerCase();
    const rows = document.querySelectorAll("#encyclopediaTable tbody tr");

    rows.forEach(row => {
        const title = row.cells[1].textContent.toLowerCase();
        const content = row.cells[2].textContent.toLowerCase();

        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// ============== 页面加载初始化 ==============
document.addEventListener("DOMContentLoaded", function() {
    loadEncyclopedias();

    const encyclopediaForm = document.getElementById("encyclopediaForm");
    if (encyclopediaForm) {
        encyclopediaForm.addEventListener("submit", function(e) {
            e.preventDefault();
            saveEncyclopedia();
        });
    }

    const cancelBtn = document.getElementById("cancelEncyclopediaBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", hideEncyclopediaForm);
    }
});

// 导出函数供HTML调用
window.showEncyclopediaForm = showEncyclopediaForm;
window.hideEncyclopediaForm = hideEncyclopediaForm;
window.saveEncyclopedia = saveEncyclopedia;
window.editEncyclopedia = editEncyclopedia;
window.deleteEncyclopedia = deleteEncyclopedia;
window.searchEncyclopedia = searchEncyclopedia;