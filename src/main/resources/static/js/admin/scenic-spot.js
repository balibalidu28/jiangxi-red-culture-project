// API基址
const API_SCENIC = "http://localhost:8080/scenicspots/api";

// ============== 图片URL辅助函数 ==============
function getFullImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return 'http://localhost:8080' + (path.startsWith('/') ? path : '/' + path);
}

// 图片预览函数
function previewImage(imgSrc, title) {
    const modalHtml = `
        <div id="imageModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
            <div style="
                background: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 90%;
                max-height: 90%;
                overflow: auto;
            ">
                <h3 style="margin-top:0;">${title || '图片预览'}</h3>
                <img src="${imgSrc}" alt="预览" style="max-width: 800px; max-height: 500px;">
                <div style="text-align:right; margin-top:10px;">
                    <button onclick="document.getElementById('imageModal').remove()" 
                            style="padding: 5px 15px; cursor:pointer;">
                        关闭
                    </button>
                </div>
            </div>
        </div>
    `;

    // 移除已存在的模态框
    const existingModal = document.getElementById('imageModal');
    if (existingModal) existingModal.remove();

    // 添加新的模态框
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

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

        const result = await response.json();
        console.log("API响应:", result);

        // 修复：从ApiResponse中获取data数组
        if (!result.success) {
            throw new Error(result.message || "API返回失败");
        }

        const spots = result.data || [];
        console.log("获取到的圣地数据:", spots);

        const scenicTableBody = document.querySelector("#scenicTable tbody");
        if (!scenicTableBody) {
            console.error("找不到表格tbody元素");
            return;
        }
        scenicTableBody.innerHTML = "";

        if (spots.length === 0) {
            scenicTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#999;">暂无数据</td></tr>';
            return;
        }

        spots.forEach(spot => {
            const rawImg = spot.imageUrl || '';
            const imgSrc = getFullImageUrl(rawImg);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${spot.id}</td>
                <td>${spot.name || ''}</td>
                <td>${spot.location || ''}</td>
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

            // 点击缩略图 -> 弹窗预览
            const img = row.querySelector('.scenic-thumbnail');
            if (img && rawImg) {
                img.addEventListener('click', () => {
                    previewImage(imgSrc, spot.name);
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
    console.log("========== saveScenic开始 ==========");

    const id = (document.getElementById("scenicId").value || '').trim();
    const name = (document.getElementById("scenic-name").value || '').trim();
    const location = (document.getElementById("scenic-location").value || '').trim();
    const description = (document.getElementById("scenic-description").value || '').trim();
    const oldImageUrl = (document.getElementById("scenicImageUrlHidden").value || '').trim();
    const imageFile = document.getElementById("scenic-image").files[0];

    console.log("表单数据:");
    console.log("ID:", id);
    console.log("名称:", name);
    console.log("地点:", location);
    console.log("描述:", description);
    console.log("原图片URL:", oldImageUrl);
    console.log("新图片文件:", imageFile ? imageFile.name : "无");

    if (!name || !location) {
        alert("名称和地点为必填项！");
        return;
    }

    const isEdit = !!id;
    console.log("是否为编辑:", isEdit);

    let scenicId = id;

    try {
        // 1. 如果有图片文件，先上传图片
        let finalImageUrl = oldImageUrl;
        if (imageFile) {
            // 如果没有ID（新增），先创建圣地获取ID
            if (!scenicId) {
                console.log("新增圣地，先创建基本信息...");
                const createData = {
                    name,
                    location,
                    description: description || "",
                    imageUrl: null
                };

                const createResponse = await fetch(API_SCENIC, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(createData)
                });

                console.log("创建响应状态:", createResponse.status);

                if (!createResponse.ok) {
                    const errorText = await createResponse.text();
                    throw new Error(`创建失败: ${errorText}`);
                }

                const createResult = await createResponse.json();
                console.log("创建响应:", createResult);

                if (!createResult.success) {
                    throw new Error(createResult.message || "创建失败");
                }

                scenicId = createResult.data.id;
                console.log("创建成功，获取ID:", scenicId);
            }

            // 上传图片
            console.log("上传图片到圣地ID:", scenicId);
            finalImageUrl = await uploadScenicImage(scenicId, imageFile);
            console.log("图片上传成功，新URL:", finalImageUrl);
        }

        // 2. 保存/更新圣地基本信息
        const spotData = {
            name,
            location,
            description: description || "",
            imageUrl: finalImageUrl || (isEdit ? oldImageUrl : null)
        };

        console.log("最终发送的数据:", spotData);

        // 3. 如果是编辑或者有图片上传，需要更新
        if (isEdit || (imageFile && scenicId)) {
            console.log(`PUT请求: ${API_SCENIC}/${scenicId}`);
            const response = await fetch(`${API_SCENIC}/${scenicId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(spotData)
            });

            console.log("响应状态:", response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("请求失败详情:", errorText);
                throw new Error(`请求失败: ${response.status}`);
            }

            const result = await response.json();
            console.log("API响应:", result);

            if (!result.success) {
                throw new Error(result.message || "操作失败");
            }
        }

        console.log("========== saveScenic成功 ==========");
        alert(isEdit ? "圣地更新成功！" : "圣地创建成功！");
        hideScenicForm();
        loadScenicSpots();

    } catch (error) {
        console.error("保存错误详情:", error);
        alert("保存失败：" + error.message);
    }
}

// ============== 上传圣地图片 ==============
async function uploadScenicImage(scenicId, imageFile) {
    console.log("开始上传图片...");
    const formData = new FormData();
    formData.append('file', imageFile);

    console.log("上传参数:", {
        scenicId: scenicId,
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type
    });

    const response = await fetch(`${API_SCENIC}/${scenicId}/upload-image`, {
        method: "POST",
        body: formData
    });

    console.log("图片上传响应状态:", response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("图片上传失败:", errorText);
        throw new Error(`图片上传失败: ${errorText}`);
    }

    const result = await response.json();
    console.log("图片上传成功，结果:", result);
    return result.url;
}

// ============== 编辑功能 ==============
async function editScenic(id) {
    console.log("========== 编辑圣地开始 ==========");
    console.log("圣地ID:", id);

    try {
        // 调用详情API
        const response = await fetch(`${API_SCENIC}/${id}`);
        console.log("详情API响应状态:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("详情API错误:", errorText);
            throw new Error(`获取圣地详情失败: ${response.status}`);
        }

        const result = await response.json();
        console.log("详情API完整响应:", result);

        if (!result.success) {
            throw new Error(result.message || "API返回失败");
        }

        const spot = result.data;
        if (!spot) throw new Error("未找到ID为 " + id + " 的圣地");

        console.log("找到要编辑的圣地数据:", {
            id: spot.id,
            name: spot.name,
            location: spot.location,
            imageUrl: spot.imageUrl
        });

        // 填充表单
        document.getElementById("scenicId").value = spot.id || '';
        document.getElementById("scenic-name").value = spot.name || "";
        document.getElementById("scenic-location").value = spot.location || "";
        document.getElementById("scenic-description").value = spot.description || "";

        // 回填原图片
        const rawImg = spot.imageUrl || '';
        console.log("原始图片URL:", rawImg);
        document.getElementById("scenicImageUrlHidden").value = rawImg;

        const box = document.getElementById("scenic-current-image-box");
        const img = document.getElementById("scenic-current-image");
        const link = document.getElementById("scenic-current-image-link");

        if (rawImg) {
            const imgSrc = getFullImageUrl(rawImg);
            console.log("完整图片URL:", imgSrc);
            if (img) img.src = imgSrc;
            if (link) link.href = imgSrc;
            if (box) box.style.display = 'block';
        } else {
            if (img) img.removeAttribute('src');
            if (link) link.removeAttribute('href');
            if (box) box.style.display = 'none';
        }

        // 清空文件选择
        const fileInput = document.getElementById('scenic-image');
        if (fileInput) fileInput.value = "";
        clearScenicFileDisplay();

        // 打开表单
        const formContainer = document.getElementById("scenicFormContainer");
        formContainer.style.display = "block";
        document.getElementById("scenicFormTitle").textContent = "编辑圣地";

        console.log("========== 表单已填充完成 ==========");

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
        const response = await fetch(`${API_SCENIC}/${id}`, {
            method: "DELETE"
        });

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

function clearScenicFileSelection() {
    const fileInput = document.getElementById("scenic-image");
    if (fileInput) {
        fileInput.value = "";
        clearScenicFileDisplay();
    }
}

function clearScenicFileDisplay() {
    const displayDiv = document.getElementById("scenicFileDisplay");
    if (displayDiv) {
        displayDiv.innerHTML = '<span style="color:#888;">未选择文件</span>';
    }
}

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
    console.log("圣地管理页面初始化");
    loadScenicSpots();

    // 文件选择监听
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

    // 表单提交监听
    const scenicForm = document.getElementById("scenicForm");
    if (scenicForm) {
        scenicForm.addEventListener("submit", function(e) {
            e.preventDefault();
            saveScenic();
        });
    }

    // 取消按钮监听
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
window.previewImage = previewImage; // 导出预览函数