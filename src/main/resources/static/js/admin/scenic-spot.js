// API基址（注意和你的Controller一致！）
const API_SCENIC = window.STATIC_ORIGIN + "/scenicspots/api";

// ============== 加载圣地列表 ==============
async function loadScenicSpots() {
    console.log("开始加载圣地列表...");
    console.log("请求URL:", API_SCENIC);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(API_SCENIC, { signal: controller.signal });
        clearTimeout(timeoutId);

        console.log("响应状态:", response.status, response.statusText);
        if (!response.ok) throw new Error(`HTTP错误! 状态: ${response.status} ${response.statusText}`);

        const spots = await response.json();
        console.log("获取到的圣地数据:", spots);

        const scenicTableBody = document.querySelector("#scenicTable tbody");
        if (!scenicTableBody) {
            console.error("找不到表格tbody元素");
            return;
        }
        scenicTableBody.innerHTML = "";

        spots.forEach(spot => {
            const rawImg = spot.imageUrl ?? spot.image_url ?? '';
            const imgSrc = rawImg ? window.assetUrl(rawImg) : '#';

            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${spot.id}</td>
        <td>${spot.name ?? ''}</td>
        <td>${spot.location ?? ''}</td>
        <td>${spot.description || "暂无简介"}</td>
        <td>
          ${rawImg
                ? `<img src="${imgSrc}" alt="圣地图片" width="50" class="scenic-thumbnail" style="cursor:pointer">`
                : `<span style="color:#999">无</span>`}
        </td>
        <td>
          <button type="button" onclick="editScenic(${spot.id})">编辑</button>
          <button type="button" onclick="deleteScenic(${spot.id})">删除</button>
        </td>
      `;
            // 点击缩略图 -> 弹窗预览（不跳转）
            const img = row.querySelector('.scenic-thumbnail');
            if (img && rawImg) {
                img.addEventListener('click', () => {
                    window.previewImage(rawImg, spot.name);
                });
            }
            scenicTableBody.appendChild(row);
        });

        console.log("圣地列表加载完成，共" + spots.length + "条记录");
    } catch (error) {
        console.error("加载圣地列表失败:", error);
        if (error.name === 'AbortError') {
            alert("请求超时！请检查后端服务是否正常运行。");
        } else if (error.message.includes('Failed to fetch')) {
            alert("无法连接到服务器！请检查：\n1. 后端服务是否运行\n2. 网络连接\n3. CORS配置");
        } else {
            alert("加载圣地列表失败: " + error.message);
        }
    }
}

// 显示新增圣地表单
function showScenicForm() {
    const formContainer = document.getElementById("scenicFormContainer");
    formContainer.style.display = "block";
    document.getElementById("scenicFormTitle").textContent = "新增圣地";
    document.getElementById("scenicForm").reset();
    document.getElementById("scenicId").value = "";

    // 清空当前图片展示与隐藏域
    document.getElementById("scenicImageUrlHidden").value = "";
    const box = document.getElementById("scenic-current-image-box");
    const img = document.getElementById("scenic-current-image");
    const link = document.getElementById("scenic-current-image-link");
    if (img) img.removeAttribute('src');
    if (link) link.removeAttribute('href');
    if (box) box.style.display = 'none';

    // 清空文件选择
    const fileInput = document.getElementById('scenic-image');
    if (fileInput) fileInput.value = "";
}

// 隐藏新增圣地表单
function hideScenicForm() {
    const formContainer = document.getElementById("scenicFormContainer");
    formContainer.style.display = "none";
}

// 保存圣地信息（新增或编辑）
// 说明：未实现上传逻辑；若不选择新图片，继续保留旧图
async function saveScenic() {
    console.log("saveScenic() 开始执行");

    const id = (document.getElementById("scenicId").value || '').trim();
    const name = (document.getElementById("scenic-name").value || '').trim();
    const location = (document.getElementById("scenic-location").value || '').trim();
    const description = (document.getElementById("scenic-description").value || '').trim();
    const oldImageUrl = (document.getElementById("scenicImageUrlHidden").value || '').trim();
    const imageFile = document.getElementById("scenic-image").files[0];

    if (!name || !location) {
        alert("名称和地点为必填项！");
        return;
    }

    // 仅保留旧图；如果选了文件，这里不上传，只提示（如需上传，告知我接口路径我来补）
    let finalImageUrl = oldImageUrl;
    if (imageFile) {
        alert("当前未实现图片上传功能，将继续保留原图片。");
    }

    const spotData = {
        name,
        location,
        description: description || "",
        imageUrl: finalImageUrl || null
    };
    console.log("要发送的数据:", spotData);

    try {
        const method = id ? "PUT" : "POST";
        const url = id ? `${API_SCENIC}/${id}` : API_SCENIC;

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spotData)
        });

        console.log("响应状态:", response.status);

        if (response.ok) {
            const result = await response.json();
            console.log("保存成功:", result);
            alert(id ? "修改圣地成功！" : "新增圣地成功！");
            hideScenicForm();
            loadScenicSpots();
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

// ============== 编辑功能（回填原图片并在表单中显示） ==============
async function editScenic(id) {
    console.log("开始编辑圣地，ID:", id);

    try {
        const response = await fetch(API_SCENIC);
        if (!response.ok) throw new Error(`获取圣地列表失败: ${response.status}`);

        const spots = await response.json();
        const spot = spots.find(s => s.id === id);
        if (!spot) throw new Error("未找到ID为 " + id + " 的圣地");

        console.log("找到要编辑的圣地:", spot);

        document.getElementById("scenicId").value = spot.id;
        document.getElementById("scenic-name").value = spot.name || "";
        document.getElementById("scenic-location").value = spot.location || "";
        document.getElementById("scenic-description").value = spot.description || "";

        // 回填原图片：隐藏域 + 表单内展示
        const rawImg = spot.imageUrl ?? spot.image_url ?? '';
        document.getElementById("scenicImageUrlHidden").value = rawImg || "";

        const box = document.getElementById("scenic-current-image-box");
        const img = document.getElementById("scenic-current-image");
        const link = document.getElementById("scenic-current-image-link");

        if (rawImg) {
            if (img) img.src = window.assetUrl(rawImg);
            if (link) link.href = window.assetUrl(rawImg);
            if (box) box.style.display = 'block';
        } else {
            if (img) img.removeAttribute('src');
            if (link) link.removeAttribute('href');
            if (box) box.style.display = 'none';
        }

        // 清空文件选择
        const fileInput = document.getElementById('scenic-image');
        if (fileInput) fileInput.value = "";

        // 打开表单
        const formContainer = document.getElementById("scenicFormContainer");
        formContainer.style.display = "block";
        document.getElementById("scenicFormTitle").textContent = "编辑圣地";

        console.log("表单已填充，准备编辑");
    } catch (error) {
        console.error("编辑圣地失败:", error);
        alert("加载圣地详情失败: " + error.message);
    }
}

// ============== 删除功能 ==============
async function deleteScenic(id) {
    console.log("尝试删除圣地，ID:", id);

    if (!confirm("确定要删除这个圣地吗？此操作不可撤销！")) {
        return;
    }

    try {
        const response = await fetch(`${API_SCENIC}/${id}`, { method: "DELETE" });
        if (response.ok) {
            console.log("删除成功");
            alert("删除圣地成功！");
            loadScenicSpots();
        } else {
            const errorText = await response.text();
            console.error("删除失败:", response.status, errorText);
            alert("删除失败: " + errorText);
        }
    } catch (error) {
        console.error("删除圣地过程中发生错误:", error);
        alert("删除失败: " + error.message);
    }
}

// ============== 搜索功能 ==============
function searchScenic() {
    const searchTerm = (document.getElementById("scenicSearch")?.value || '').toLowerCase();
    const rows = document.querySelectorAll("#scenicTable tbody tr");

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const location = row.cells[2].textContent.toLowerCase();
        row.style.display = (name.includes(searchTerm) || location.includes(searchTerm)) ? "" : "none";
    });
}

// ============== 页面加载初始化 ==============
document.addEventListener("DOMContentLoaded", function() {
    loadScenicSpots();

    const scenicForm = document.getElementById("scenicForm");
    if (scenicForm) {
        scenicForm.addEventListener("submit", function(e) {
            e.preventDefault();
            saveScenic();
        });
    }

    const cancelBtn = document.getElementById("cancelScenicBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", hideScenicForm);
});

// 导出供HTML调用
window.showScenicForm = showScenicForm;
window.hideScenicForm = hideScenicForm;
window.saveScenic = saveScenic;
window.editScenic = editScenic;
window.deleteScenic = deleteScenic;
window.searchScenic = searchScenic;
// 图片预览弹窗、关闭已在 common.js 全局暴露，无需再挂