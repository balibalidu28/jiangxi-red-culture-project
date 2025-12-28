// ============== 百科管理功能 ==============
async function loadEncyclopedias() {
    console.log("开始加载百科列表...");

    const url = "http://localhost:8080/api/admin/encyclopedia";
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

        const encyclopedia = await response.json();
        console.log("获取到的百科数据:", encyclopedia);

        // 根据您的HTML，选择#encyclopedia section里的第一个table
        const encyclopediaSection = document.getElementById("encyclopedia");
        if (!encyclopediaSection) {
            console.error("找不到百科管理模块");
            return;
        }

        const table = encyclopediaSection.querySelector("table");
        if (!table) {
            console.error("找不到表格元素");
            return;
        }

        const tableBody = table.querySelector("tbody");
        if (!tableBody) {
            console.error("找不到表格tbody元素");
            return;
        }

        tableBody.innerHTML = ""; // 清空旧表格内容

        encyclopedia.forEach(item => {
            const row = document.createElement("tr");

            // 处理图片显示 - 修复版
            let imageCell = `<div style="width:50px;height:50px;background:#f5f5f5;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;">无图片</div>`;

            if (item.imageUrl && item.imageUrl.trim() !== '') {
                let imgUrl = item.imageUrl;
                let fullImgUrl = imgUrl;

                // 如果图片路径是相对路径，添加base URL
                if (imgUrl.startsWith('/') && !imgUrl.startsWith('http')) {
                    fullImgUrl = 'http://localhost:8080' + imgUrl;
                }

                // 智能图片加载：带加载状态和重试机制
                imageCell = `
                    <div id="img-container-${item.id}" 
                         style="width:50px;height:50px;position:relative;background:#f5f5f5;border-radius:4px;overflow:hidden;">
                        
                        <!-- 加载中状态 -->
                        <div id="loading-${item.id}" 
                             style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <div class="loading-spinner" 
                                 style="width:16px;height:16px;border:2px solid #ddd;border-top-color:#4CAF50;border-radius:50%;"></div>
                        </div>
                        
                        <!-- 实际图片 -->
                        <img src="${fullImgUrl}" 
                             alt="${item.title}" 
                             style="width:100%;height:100%;object-fit:cover;cursor:pointer;display:none;"
                             onload="handleImageLoad(${item.id})"
                             onerror="handleImageError(${item.id}, '${fullImgUrl}')"
                             onclick="previewImage('${imgUrl}', '${item.title || '百科图片'}')">
                    </div>
                `;
            }

            // 截断过长的内容
            let shortContent = item.content || "暂无内容";
            if (shortContent.length > 30) {
                shortContent = shortContent.substring(0, 30) + '...';
            }

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title || "未命名"}</td>
                <td title="${item.content || ''}">${shortContent}</td>
                <td>${imageCell}</td>
                <td>
                    <button onclick="editEncyclopedia(${item.id})">编辑</button>
                    <button onclick="deleteEncyclopedia(${item.id})">删除</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // 添加CSS动画
        if (!document.getElementById('loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .loading-spinner {
                    animation: spin 1s linear infinite;
                }
            `;
            document.head.appendChild(style);
        }

        console.log("百科列表加载完成，共" + encyclopedia.length + "条记录");
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
    if (!formContainer) {
        console.error("找不到百科表单容器");
        return;
    }
    formContainer.style.display = "block";
    document.getElementById("encyclopediaFormTitle").textContent = "新增百科";
    document.getElementById("encyclopediaForm").reset();
    document.getElementById("encyclopediaId").value = ""; // 清空隐藏的ID
    document.getElementById("encyclopediaImageUrlHidden").value = ""; // 清空图片URL

    // 隐藏图片预览
    const imagePreviewBox = document.getElementById("encyclopedia-current-image-box");
    if (imagePreviewBox) imagePreviewBox.style.display = "none";

    // 清空文件输入框
    const fileInput = document.getElementById("encyclopedia-image");
    if (fileInput) fileInput.value = "";
}

// 隐藏新增百科表单
function hideEncyclopediaForm() {
    const formContainer = document.getElementById("encyclopediaFormContainer");
    if (formContainer) {
        formContainer.style.display = "none";
    }
}

// ============== 图片相关功能 ==============

// 上传百科图片
async function uploadEncyclopediaImage(encyclopediaId, imageFile) {
    console.log("开始上传百科图片，ID:", encyclopediaId, "文件名:", imageFile.name);

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
        const response = await fetch(`http://localhost:8080/encyclopedia/api/${encyclopediaId}/upload-image`, {
            method: 'POST',
            body: formData
        });

        console.log("上传响应状态:", response.status);

        if (response.ok) {
            const result = await response.json();
            console.log("图片上传成功:", result);
            return result.url; // 返回图片URL
        } else {
            const errorText = await response.text();
            console.error("图片上传失败:", errorText);
            throw new Error("图片上传失败: " + errorText);
        }
    } catch (error) {
        console.error("上传图片出错:", error);
        throw error;
    }
}

// 图片加载成功处理
window.handleImageLoad = function(id) {
    console.log(`图片加载成功: ID ${id}`);
    const loading = document.getElementById(`loading-${id}`);
    const img = document.getElementById(`img-container-${id}`)?.querySelector('img');

    if (loading) loading.style.display = 'none';
    if (img) img.style.display = 'block';
};

// 图片加载失败处理（带自动重试）
window.handleImageError = function(id, fullImgUrl) {
    console.log(`图片加载失败，开始重试: ID ${id}`);

    const loading = document.getElementById(`loading-${id}`);
    const img = document.getElementById(`img-container-${id}`)?.querySelector('img');

    if (loading) {
        loading.innerHTML = `
            <div style="text-align:center;color:#666;font-size:10px;padding:5px;">
                加载中...
            </div>
        `;
    }

    // 延迟重试：2秒、5秒、10秒
    const retryDelays = [2000, 5000, 10000];
    let retryCount = 0;

    function retry() {
        if (retryCount >= retryDelays.length) {
            // 所有重试失败
            if (loading) {
                loading.innerHTML = `
                    <div style="text-align:center;color:#f00;font-size:10px;padding:5px;">
                        加载失败
                    </div>
                `;
            }
            return;
        }

        const delay = retryDelays[retryCount];
        console.log(`第${retryCount + 1}次重试，等待${delay}ms`);

        setTimeout(() => {
            const testImg = new Image();
            testImg.onload = function() {
                console.log(`重试成功: ID ${id}`);
                if (img) {
                    img.src = fullImgUrl + '?t=' + Date.now();
                }
            };
            testImg.onerror = function() {
                retryCount++;
                retry();
            };
            testImg.src = fullImgUrl + '?test=' + Date.now();
        }, delay);
    }

    retry();
};

// 保存百科信息（支持图片上传）
async function saveEncyclopedia() {
    console.log("saveEncyclopedia() 开始执行");

    const id = document.getElementById("encyclopediaId").value;
    const title = document.getElementById("encyclopedia-name").value;
    const content = document.getElementById("encyclopedia-content").value;
    const fileInput = document.getElementById("encyclopedia-image");
    const imageFile = fileInput?.files?.[0];
    const existingImageUrl = document.getElementById("encyclopediaImageUrlHidden")?.value || "";

    console.log("表单数据:", {
        id: id,
        title: title,
        content: content,
        existingImageUrl: existingImageUrl,
        hasFile: !!imageFile
    });

    if (!title || !content) {
        alert("标题和内容为必填项！");
        return;
    }

    const itemData = {
        title: title,
        content: content
    };

    // 如果已有图片URL，先包含进去
    if (existingImageUrl && existingImageUrl.trim() !== '') {
        itemData.imageUrl = existingImageUrl;
    }

    console.log("要发送的数据:", itemData);

    try {
        // 1. 先保存百科基本信息
        const method = id ? "PUT" : "POST";
        const url = id ?
            `http://localhost:8080/api/admin/encyclopedia/${id}` :
            "http://localhost:8080/api/admin/encyclopedia";

        console.log("请求基本数据:", method, url);

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(itemData)
        });

        console.log("响应状态:", response.status);

        if (response.ok) {
            const result = await response.json();
            console.log("百科数据保存成功:", result);

            const savedId = result.id || id;

            // 2. 如果有新图片文件，上传图片
            if (imageFile && savedId) {
                console.log("开始上传图片...");
                try {
                    const imageUrl = await uploadEncyclopediaImage(savedId, imageFile);
                    if (imageUrl) {
                        console.log("图片上传成功，URL:", imageUrl);

                        // 3. 使用PATCH更新图片URL（只更新图片字段）
                        try {
                            await fetch(`http://localhost:8080/encyclopedia/api/${savedId}`, {
                                method: 'PATCH',
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ imageUrl: imageUrl })
                            });
                            console.log("图片URL更新完成");
                        } catch (patchError) {
                            console.warn("PATCH失败，使用PUT:", patchError);
                            // 如果PATCH失败，使用PUT更新整个对象
                            await fetch(`http://localhost:8080/api/admin/encyclopedia/${savedId}`, {
                                method: 'PUT',
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    title: title,
                                    content: content,
                                    imageUrl: imageUrl
                                })
                            });
                        }
                    }
                } catch (uploadError) {
                    console.warn("图片上传失败，但百科数据已保存:", uploadError);
                    alert("百科数据保存成功，但图片上传失败: " + uploadError.message);
                }
            }

            alert(id ? "修改百科成功！" : "新增百科成功！\n\n注意：新上传的图片可能需要3分钟才能显示。");

            // 清空文件输入框
            if (fileInput) fileInput.value = "";

            // 延迟3秒后刷新列表
            setTimeout(() => {
                hideEncyclopediaForm();
                loadEncyclopedias();
            }, 3000);

        } else {
            const errorText = await response.text();
            console.error("保存失败:", errorText);
            alert("保存失败: " + errorText);
        }
    } catch (error) {
        console.error("请求错误:", error);
        alert("网络错误，请重试: " + error.message);
    }
}

// 编辑百科功能（带图片预览）
async function editEncyclopedia(id) {
    console.log("开始编辑百科，ID:", id);

    try {
        const response = await fetch(`http://localhost:8080/encyclopedia/${id}`);
        if (!response.ok) {
            throw new Error(`获取百科详情失败: ${response.status}`);
        }

        const item = await response.json();
        console.log("找到要编辑的百科:", item);

        // 填充表单
        document.getElementById("encyclopediaId").value = item.id;
        document.getElementById("encyclopedia-name").value = item.title || "";
        document.getElementById("encyclopedia-content").value = item.content || "";

        // 显示当前图片（如果有）
        const imagePreview = document.getElementById("encyclopedia-current-image");
        const imagePreviewBox = document.getElementById("encyclopedia-current-image-box");
        const imageUrlHidden = document.getElementById("encyclopediaImageUrlHidden");

        if (item.imageUrl && imagePreview && imagePreviewBox && imageUrlHidden) {
            // 设置隐藏字段的值
            imageUrlHidden.value = item.imageUrl;

            // 显示图片预览
            const fullImageUrl = item.imageUrl.startsWith('http')
                ? item.imageUrl
                : `http://localhost:8080${item.imageUrl}`;
            imagePreview.src = fullImageUrl;
            imagePreviewBox.style.display = 'block';

            // 添加点击预览功能
            imagePreview.onclick = function() {
                previewImage(fullImageUrl, item.title || '百科图片');
            };
        } else if (imagePreviewBox) {
            imagePreviewBox.style.display = 'none';
        }

        // 显示表单
        const formContainer = document.getElementById("encyclopediaFormContainer");
        formContainer.style.display = "block";
        document.getElementById("encyclopediaFormTitle").textContent = "编辑百科";

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
        const response = await fetch(`http://localhost:8080/api/admin/encyclopedia/${id}`, {
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
    console.log("搜索功能需要先在HTML中添加搜索框");
}

// 页面加载初始化
document.addEventListener("DOMContentLoaded", function() {
    loadEncyclopedias();

    // 绑定表单提交事件
    const encyclopediaForm = document.getElementById("encyclopediaForm");
    if (encyclopediaForm) {
        encyclopediaForm.addEventListener("submit", function(e) {
            e.preventDefault();
            saveEncyclopedia();
        });
    }
});

// 导出函数供HTML调用
window.showEncyclopediaForm = showEncyclopediaForm;
window.hideEncyclopediaForm = hideEncyclopediaForm;
window.saveEncyclopedia = saveEncyclopedia;
window.editEncyclopedia = editEncyclopedia;
window.deleteEncyclopedia = deleteEncyclopedia;
window.searchEncyclopedia = searchEncyclopedia;
window.loadEncyclopedias = loadEncyclopedias;
window.handleImageLoad = handleImageLoad;
window.handleImageError = handleImageError;