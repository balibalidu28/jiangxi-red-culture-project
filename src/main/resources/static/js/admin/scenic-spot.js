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

// ============== 显示新增圣地表单 ==============
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

    // 清空文件选择和显示
    const fileInput = document.getElementById('scenic-image');
    if (fileInput) fileInput.value = "";

    // 清除文件选择显示
    clearScenicFileDisplay();
}

// ============== 隐藏新增圣地表单 ==============
function hideScenicForm() {
    const formContainer = document.getElementById("scenicFormContainer");
    formContainer.style.display = "none";
}

// ============== 保存圣地信息（支持图片上传） ==============
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

    const isEdit = !!id;
    let scenicId = id;

    try {
        // 1. 先保存/更新圣地基本信息
        const spotData = {
            name,
            location,
            description: description || "",
            // 编辑时如果没有选择新图片，保留旧图
            imageUrl: (isEdit && !imageFile && oldImageUrl) ? oldImageUrl : null
        };

        if (isEdit) {
            const response = await fetch(`${API_SCENIC}/${scenicId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(spotData)
            });

            if (!response.ok) throw new Error("更新失败");
        } else {
            const response = await fetch(API_SCENIC, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(spotData)
            });

            if (!response.ok) throw new Error("创建失败");

            const result = await response.json();
            scenicId = result.id;
            if (!scenicId) throw new Error("无法获取圣地ID");
        }

        // 2. 如果有图片文件，上传图片
        if (imageFile && scenicId) {
            await uploadScenicImage(scenicId, imageFile);
        }

        alert(isEdit ? "圣地更新成功！" : "圣地创建成功！");
        hideScenicForm();
        loadScenicSpots();

    } catch (error) {
        alert("保存失败：" + error.message);
        console.error("保存错误：", error);
    }
}

// ============== 上传圣地图片 ==============
async function uploadScenicImage(scenicId, imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`${API_SCENIC}/${scenicId}/upload-image`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`图片上传失败: ${errorText}`);
    }

    const result = await response.json();
    console.log("图片保存到static/images/scenic/: ", result.url);
    return result.url;
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

        // 清空文件选择和显示
        const fileInput = document.getElementById('scenic-image');
        if (fileInput) fileInput.value = "";
        clearScenicFileDisplay();

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

// ============== 文件选择和显示功能 ==============
// 初始化文件选择监听
document.addEventListener("DOMContentLoaded", function() {
    loadScenicSpots();

    const fileInput = document.getElementById("scenic-image");
    if (fileInput) {
        fileInput.addEventListener("change", function() {
            if (this.files.length > 0) {
                updateScenicFileDisplay();
                previewSelectedScenicImage(this.files[0]);
            } else {
                clearScenicFileDisplay();
            }
        });
    }
});

// 更新文件显示
function updateScenicFileDisplay() {
    const fileInput = document.getElementById("scenic-image");
    const displayDiv = document.getElementById("scenicFileDisplay") || createScenicFileDisplay();

    if (!fileInput || !displayDiv) return;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileSize = (file.size / 1024).toFixed(2);
        displayDiv.innerHTML = `
            <div style="color: #1890ff; font-weight: bold;">
                ✓ 已选择图片文件
            </div>
            <div style="margin-top: 5px;">
                <strong>文件名：</strong>${file.name}<br>
                <strong>文件大小：</strong>${fileSize} KB<br>
                <strong>文件类型：</strong>${file.type || '未知'}
            </div>
            <button onclick="clearScenicFileSelection()" style="
                margin-top: 8px;
                padding: 4px 12px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 3px;
                cursor: pointer;
                font-size: 13px;
            ">清除选择</button>
        `;
        displayDiv.style.display = "block";
    } else {
        displayDiv.innerHTML = '<span style="color:#888;">未选择文件</span>';
    }
}

// 创建文件显示元素
function createScenicFileDisplay() {
    const fileInput = document.getElementById("scenic-image");
    if (!fileInput) return null;

    const displayDiv = document.createElement("div");
    displayDiv.id = "scenicFileDisplay";
    displayDiv.style.cssText = `
        margin-top: 8px;
        padding: 8px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 14px;
        color: #555;
        display: none;
    `;

    fileInput.parentNode.insertBefore(displayDiv, fileInput.nextSibling);
    return displayDiv;
}

// 清除文件选择
function clearScenicFileSelection() {
    const fileInput = document.getElementById("scenic-image");
    if (fileInput) {
        fileInput.value = "";
        clearScenicFileDisplay();
    }
}

// 清除文件显示
function clearScenicFileDisplay() {
    const displayDiv = document.getElementById("scenicFileDisplay");
    if (displayDiv) {
        displayDiv.innerHTML = '<span style="color:#888;">未选择文件</span>';
    }
}

// 预览选择的图片
function previewSelectedScenicImage(file) {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImg = document.getElementById("scenic-current-image");
        const previewLink = document.getElementById("scenic-current-image-link");

        if (previewImg) {
            previewImg.src = e.target.result;
            if (previewLink) previewLink.href = e.target.result;
        }

        // 显示预览框
        const previewBox = document.getElementById("scenic-current-image-box");
        if (previewBox) previewBox.style.display = "block";
    };
    reader.readAsDataURL(file);
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
window.clearScenicFileSelection = clearScenicFileSelection;