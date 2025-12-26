// ========================== 故事管理 ==========================

// 加载故事列表
async function loadStories() {
    console.log("loadStories() 被调用");
    const url = window.STATIC_ORIGIN + "/stories/api/admin";
    console.log("加载故事列表，URL:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP错误! 状态: ${response.status}, 详情: ${errorText}`);
        }
        const stories = await response.json();

        console.log("获取到的故事数据：", stories);

        const storyTableBody = document.querySelector("#storyTable tbody");
        if (!storyTableBody) {
            console.error("找不到故事表格tbody元素");
            return;
        }
        storyTableBody.innerHTML = ""; // 清空旧表格内容

        if (!stories || stories.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="7">暂无故事数据</td>`;
            storyTableBody.appendChild(row);
            return;
        }

        stories.forEach(story => {
            const imgUrl = story.imageUrl ?? story.image_url ?? "";
            const resolvedImgUrl = imgUrl
                ? window.assetUrl(imgUrl)  // 使用 assetUrl 函数处理路径
                : "";
            const imgHtml = resolvedImgUrl
                ? `<img src="${resolvedImgUrl}" 
                     style="width:40px;height:40px;object-fit:cover;cursor:pointer;border-radius:3px;" 
                     onclick="previewImage('${imgUrl}','${escapeHTML(story.title)}')">`
                : '<span style="color:#aaa;">无</span>';

            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${story.id || ''}</td>
            <td>${escapeHTML(story.title || "未命名")}</td>
            <td>${escapeHTML(story.summary || "-")}</td>
            <td>${escapeHTML(story.location || "-")}</td>
            <td>${escapeHTML(story.storyTime || "-")}</td>
            <td>${imgHtml}</td>
            <td>
                <button onclick="editStory(${story.id})">编辑</button>
                <button onclick="deleteStory(${story.id})">删除</button>
            </td>
            `;
            storyTableBody.appendChild(row);
        });

        console.log("故事列表加载完成，共" + stories.length + "条记录");
    } catch (error) {
        console.error("加载故事列表失败:", error);
        alert("加载故事列表失败: " + error.message);
    }
}

// 防止 XSS
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// 显示新增故事表单
function showStoryForm() {
    const formContainer = document.getElementById("storyFormContainer");
    formContainer.style.display = "block";
    document.getElementById("storyFormTitle").textContent = "新增故事";
    document.getElementById("storyForm").reset();
    document.getElementById("storyId").value = "";
    document.getElementById("storyImageUrlHidden").value = "";

    // 清空图片预览
    const imgEl = document.getElementById("story-current-image");
    const imgBox = document.getElementById("story-current-image-box");
    if (imgEl) imgEl.src = "";
    if (imgBox) imgBox.style.display = "none";

    // 清空文件选择
    const fileInput = document.getElementById("story-image");
    if (fileInput) fileInput.value = "";
}

// 隐藏故事表单
function hideStoryForm() {
    document.getElementById("storyFormContainer").style.display = "none";
}

// 保存故事信息
async function saveStory() {
    const id = document.getElementById("storyId").value;
    const title = document.getElementById("story-title").value.trim();
    const content = document.getElementById("story-content").value.trim();
    const imageFile = document.getElementById("story-image").files[0];
    const existingImageUrl = (document.getElementById("storyImageUrlHidden").value || "").trim();

    if (!title) {
        alert("故事标题为必填项！");
        return;
    }

    const storyData = {
        title: title,
        content: content || "",
        source: document.getElementById("story-source").value || "",
        summary: document.getElementById("story-summary").value || "",
        storyTime: document.getElementById("story-storyTime").value || "",
        location: document.getElementById("story-location").value || "",
        heroName: document.getElementById("story-heroName").value || ""
    };

    const isEdit = !!id;

    // 编辑时如果有旧图片且没选新图片，保留旧图片
    if (isEdit && !imageFile && existingImageUrl) {
        storyData.imageUrl = existingImageUrl;
    }

    try {
        const method = isEdit ? "PUT" : "POST";
        const url = isEdit
            ? `${window.STATIC_ORIGIN}/stories/api/admin/${id}`
            : `${window.STATIC_ORIGIN}/stories/api/admin`;

        console.log("保存故事:", method, url, storyData);

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(storyData)
        });

        if (!response.ok) {
            const text = await response.text().catch(() => "");
            throw new Error(`保存失败：${text || response.status}`);
        }

        const result = await response.json();
        const storyId = result.id || id;
        console.log("保存成功，故事ID:", storyId);

        // 上传图片（如果有）
        if (imageFile && storyId) {
            await uploadStoryImage(storyId, imageFile);
        }

        alert(isEdit ? "故事更新成功！" : "故事创建成功！");
        hideStoryForm();
        loadStories();

    } catch (error) {
        alert("保存失败：" + error.message);
        console.error("保存错误：", error);
    }
}

// 上传故事图片
async function uploadStoryImage(storyId, imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    console.log("上传故事图片:", storyId, imageFile.name);

    const response = await fetch(`${window.STATIC_ORIGIN}/stories/api/admin/${storyId}/upload-image`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`图片上传失败: ${errorText}`);
    }

    const result = await response.json();
    console.log("图片上传成功:", result.url);

    // 更新隐藏字段
    document.getElementById("storyImageUrlHidden").value = result.url;
    return result.url;
}

// 编辑故事
async function editStory(id) {
    console.log("编辑故事:", id);
    try {
        const response = await fetch(`${window.STATIC_ORIGIN}/stories/api/admin/${id}`);
        if (!response.ok) {
            throw new Error(`加载失败: ${response.status}`);
        }
        const story = await response.json();

        document.getElementById("storyId").value = story.id;
        document.getElementById("story-title").value = story.title || "";
        document.getElementById("story-content").value = story.content || "";
        document.getElementById("story-source").value = story.source || "";
        document.getElementById("story-summary").value = story.summary || "";
        document.getElementById("story-storyTime").value = story.storyTime || "";
        document.getElementById("story-location").value = story.location || "";
        document.getElementById("story-heroName").value = story.heroName || "";

        // 回填图片
        const imgUrl = story.imageUrl ?? story.image_url ?? "";
        document.getElementById("storyImageUrlHidden").value = imgUrl;
        const imgBox = document.getElementById("story-current-image-box");
        const imgEl = document.getElementById("story-current-image");

        if (imgUrl) {
            imgEl.src = window.assetUrl(imgUrl);
            imgBox.style.display = 'block';
            imgEl.onclick = () => previewImage(imgUrl, story.title || "故事图片");
        } else {
            imgEl.src = "";
            imgBox.style.display = 'none';
        }

        // 显示表单
        document.getElementById("storyFormContainer").style.display = "block";
        document.getElementById("storyFormTitle").textContent = "编辑故事";

        // 清空文件选择
        const fileInput = document.getElementById("story-image");
        if (fileInput) fileInput.value = "";

    } catch (error) {
        alert("加载故事详情失败: " + error.message);
        console.error("编辑故事失败:", error);
    }
}

// 删除故事
async function deleteStory(id) {
    if (!confirm("确定要删除这个故事吗？")) return;

    try {
        const response = await fetch(`${window.STATIC_ORIGIN}/stories/api/admin/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("删除故事成功！");
            loadStories();
        } else {
            const text = await response.text();
            throw new Error(`删除失败: ${text || response.status}`);
        }
    } catch (error) {
        alert("删除失败: " + error.message);
        console.error("删除故事失败:", error);
    }
}

// 导出供 HTML 调用
window.showStoryForm = showStoryForm;
window.hideStoryForm = hideStoryForm;
window.saveStory = saveStory;
window.editStory = editStory;
window.deleteStory = deleteStory;
window.loadStories = loadStories;