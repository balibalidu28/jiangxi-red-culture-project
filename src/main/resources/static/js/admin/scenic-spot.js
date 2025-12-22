async function loadScenicSpots() {
    console.log("开始加载圣地列表...");

    const url = "http://localhost:8080/api/admin/scenicspots";
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

        const spots = await response.json();
        console.log("获取到的圣地数据:", spots);

        const scenicTableBody = document.querySelector("#scenicTable tbody");
        if (!scenicTableBody) {
            console.error("找不到表格tbody元素");
            return;
        }

        scenicTableBody.innerHTML = ""; // 清空旧表格内容

        spots.forEach(spot => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${spot.id}</td>
                <td>${spot.name}</td>
                <td>${spot.location}</td>
                <td>${spot.description || "暂无简介"}</td>
                <td><img src="${spot.imageUrl || '#'}" alt="圣地图片" width="50" class="scenic-thumbnail"></td>
                <td>
                    <button onclick="editScenic(${spot.id})">编辑</button>
                    <button onclick="deleteScenic(${spot.id})">删除</button>
                </td>
            `;
            
            // Add click event listener for image preview (safer than inline onclick)
            const img = row.querySelector('.scenic-thumbnail');
            if (img) {
                img.addEventListener('click', function() {
                    previewImage(spot.imageUrl || '#', spot.name);
                });
            }
            
            scenicTableBody.appendChild(row);
        });

        console.log("圣地列表加载完成，共" + spots.length + "条记录");
    } catch (error) {
        console.error("加载圣地列表失败:", error);
        console.error("错误名称:", error.name);
        console.error("错误消息:", error.message);

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
    document.getElementById("scenicId").value = ""; // 清空隐藏的ID
}

// 隐藏新增圣地表单
function hideScenicForm() {
    const formContainer = document.getElementById("scenicFormContainer");
    formContainer.style.display = "none";
}

// 保存圣地信息（新增或编辑）
async function saveScenic() {
    console.log("saveScenic() 开始执行");

    const id = document.getElementById("scenicId").value;
    const name = document.getElementById("scenic-name").value;
    const location = document.getElementById("scenic-location").value;
    const description = document.getElementById("scenic-description").value;

    if (!name || !location) {
        alert("名称和地点为必填项！");
        return;
    }

    const spotData = {
        name: name,
        location: location,
        description: description || ""
    };

    console.log("要发送的数据:", spotData);

    try {
        // 判断是新增还是编辑
        const method = id ? "PUT" : "POST";
        const url = id ?
            `http://localhost:8080/api/admin/scenicspots/${id}` :
            "http://localhost:8080/api/admin/scenicspots";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
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

// ============== 编辑功能 ==============
async function editScenic(id) {
    console.log("开始编辑圣地，ID:", id);

    try {
        // 获取圣地详情
        const response = await fetch(`http://localhost:8080/api/admin/scenicspots`);
        if (!response.ok) {
            throw new Error(`获取圣地列表失败: ${response.status}`);
        }

        const spots = await response.json();
        // 从列表中查找对应ID的圣地
        const spot = spots.find(s => s.id === id);

        if (!spot) {
            throw new Error("未找到ID为 " + id + " 的圣地");
        }

        console.log("找到要编辑的圣地:", spot);

        // 填充表单
        document.getElementById("scenicId").value = spot.id;
        document.getElementById("scenic-name").value = spot.name || "";
        document.getElementById("scenic-location").value = spot.location || "";
        document.getElementById("scenic-description").value = spot.description || "";

        // 显示表单并修改标题
        const formContainer = document.getElementById("scenicFormContainer");
        formContainer.style.display = "block";
        document.getElementById("scenicFormTitle").textContent = "编辑圣地";

        // 修改提交按钮文本
        const submitBtn = document.querySelector("#scenicForm button[type='submit']");
        if (submitBtn) {
            submitBtn.textContent = "更新";
        }

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
        const response = await fetch(`http://localhost:8080/api/admin/scenicspots/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log("删除成功");
            alert("删除圣地成功！");
            loadScenicSpots(); // 刷新列表
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
    const searchTerm = document.getElementById("scenicSearch").value.toLowerCase();
    const rows = document.querySelectorAll("#scenicTable tbody tr");

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const location = row.cells[2].textContent.toLowerCase();

        if (name.includes(searchTerm) || location.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// ============== 页面加载初始化 ==============
document.addEventListener("DOMContentLoaded", function() {
    loadScenicSpots();

    // 绑定表单提交事件
    const scenicForm = document.getElementById("scenicForm");
    if (scenicForm) {
        scenicForm.addEventListener("submit", function(e) {
            e.preventDefault();
            saveScenic();
        });
    }

    // 绑定取消按钮事件
    const cancelBtn = document.getElementById("cancelScenicBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", hideScenicForm);
    }
});

// 导出函数供HTML调用
window.showScenicForm = showScenicForm;
window.hideScenicForm = hideScenicForm;
window.saveScenic = saveScenic;
window.editScenic = editScenic;
window.deleteScenic = deleteScenic;
window.searchScenic = searchScenic;

// ============== 图片预览功能 ==============
// Constants
const NO_IMAGE_PLACEHOLDER = '#';

function previewImage(imageUrl, imageName) {
    // 如果图片URL无效，不显示预览
    if (!imageUrl || imageUrl === NO_IMAGE_PLACEHOLDER) {
        alert('暂无图片');
        return;
    }

    // 创建模态框元素（如果还不存在）
    let modal = document.getElementById('imagePreviewModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imagePreviewModal';
        modal.className = 'image-preview-modal';
        modal.innerHTML = `
            <div class="image-preview-content">
                <button class="image-preview-close">&times;</button>
                <img id="previewImage" src="" alt="预览图片">
            </div>
        `;
        document.body.appendChild(modal);

        // Bind close button click event
        const closeBtn = modal.querySelector('.image-preview-close');
        closeBtn.addEventListener('click', closeImagePreview);

        // 点击模态框背景关闭预览
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImagePreview();
            }
        });

        // ESC键关闭预览 (only add once when modal is created)
        document.addEventListener('keydown', handleEscapeKey);
    }

    // 设置图片源并显示模态框
    const previewImg = document.getElementById('previewImage');
    
    // Clear previous error handler
    previewImg.onerror = null;
    
    // Set new image source
    previewImg.src = imageUrl;
    previewImg.alt = imageName || '圣地图片';
    
    // Add error handling for image loading
    previewImg.onerror = function() {
        closeImagePreview();
        alert('图片加载失败，请检查图片链接是否有效');
    };
    
    modal.classList.add('active');
}

function closeImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Handle ESC key press
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeImagePreview();
    }
}

// 导出图片预览函数
window.previewImage = previewImage;
window.closeImagePreview = closeImagePreview;