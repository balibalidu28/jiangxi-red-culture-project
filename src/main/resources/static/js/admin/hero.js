// ========================== 英雄管理 ==========================

// 显示新增英雄表单
function showHeroForm() {
    const formContainer = document.getElementById("heroFormContainer");
    formContainer.style.display = "block";
    document.getElementById("heroFormTitle").textContent = "新增英雄";
    document.getElementById("heroForm").reset();
    document.getElementById("heroId").value = ""; // 清空隐藏的ID
    document.getElementById("heroImageUrlHidden").value = "";
    document.getElementById("hero-current-image").src = "";
    document.getElementById("hero-current-image-box").style.display = "none";
    // 确保文件选择框也清空
    const fileInput = document.getElementById("hero-image");
    if (fileInput) fileInput.value = "";
}

// 隐藏新增英雄表单
function hideHeroForm() {
    document.getElementById("heroFormContainer").style.display = "none";
}

// 加载英雄列表
async function loadHeroes() {
    const url = STATIC_ORIGIN + "/heroes/api";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP错误! 状态: ${response.status}`);
        const heroes = await response.json();

        const heroTableBody = document.querySelector("#heroes table tbody");
        if (!heroTableBody) return;
        heroTableBody.innerHTML = ""; // 清空旧表格内容

        heroes.forEach(hero => {
            const imgUrl = hero.imageUrl ?? hero.image_url ?? "";
            const resolvedImgUrl = imgUrl
                ? (imgUrl.startsWith('http') ? imgUrl : STATIC_ORIGIN + (imgUrl.startsWith('/') ? imgUrl : '/' + imgUrl))
                : "";
            const imgHtml = resolvedImgUrl
                ? `<img src="${resolvedImgUrl}" style="width:40px;cursor:pointer;border-radius:3px;" onclick="previewImage('${imgUrl}','${hero.name||'英雄图片'}')">`
                : '<span style="color:#aaa;">无</span>';
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${hero.id}</td>
            <td>${hero.name || "未命名"}</td>
            <td>${hero.alias || "-"}</td>
            <td>${hero.category || "-"}</td>
            <td>${hero.gender || "-"}</td>
            <td>${hero.description ? (hero.description.length > 30 ? hero.description.substring(0, 30) + "..." : hero.description) : "暂无简介"}</td>
            <td>${imgHtml}</td>
            <td>
                <button onclick="editHero(${hero.id})">编辑</button>
                <button onclick="deleteHero(${hero.id})">删除</button>
            </td>
            `;
            heroTableBody.appendChild(row);
        });
    } catch (error) {
        alert("加载英雄列表失败: " + error.message);
    }
}

// 保存英雄信息（修复：编辑时未选择图片不再清空已有图片）
async function saveHero() {
    const id = document.getElementById("heroId").value;
    const name = document.getElementById("hero-name").value.trim();
    const imageFile = document.getElementById("hero-image").files[0];
    const existingImageUrl = (document.getElementById("heroImageUrlHidden").value || "").trim();

    if (!name) {
        alert("英雄姓名为必填项！");
        return;
    }

    // 填充所有表单字段
    const heroData = {
        name: name,
        description: document.getElementById("hero-description").value,
        alias: document.getElementById("hero-alias").value,
        title: document.getElementById("hero-title").value,
        category: document.getElementById("hero-category").value,
        content: document.getElementById("hero-content").value,
        gender: document.getElementById("hero-gender").value,
        ethnicity: document.getElementById("hero-ethnicity").value,
        birthplace: document.getElementById("hero-birthplace").value,
        politicalStatus: document.getElementById("hero-politicalStatus").value,
        birthDate: document.getElementById("hero-birthDate").value,
        deathDate: document.getElementById("hero-deathDate").value
        // 注意：不直接放 imageUrl，下面按场景决定是否添加
    };

    const isEdit = !!id;

    // 决定 imageUrl 字段是否发送：
    // - 新增：不发送（由上传接口或后端默认处理）
    // - 编辑：如果没有选择新图片，则保留旧的 existingImageUrl；如果旧的也为空，则不发送该字段（避免覆盖为空）
    if (isEdit) {
        if (!imageFile && existingImageUrl) {
            heroData.imageUrl = existingImageUrl; // 保留已有图片
        }
        // 如果 imageFile 存在，先保存主体数据，稍后上传图片；上传接口通常会更新图片地址
        // 因此此处无需提前清空 imageUrl，避免把已有图清掉
    }

    // 如果最后 imageUrl 为空字符串，则删除该字段，避免覆盖为空
    if (typeof heroData.imageUrl !== "undefined" && !heroData.imageUrl) {
        delete heroData.imageUrl;
    }

    // 先保存英雄信息
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
        ? `${STATIC_ORIGIN}/heroes/api/${id}`
        : `${STATIC_ORIGIN}/heroes/api`;

    let response;
    try {
        response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(heroData)
        });
    } catch (e) {
        alert("保存失败：" + e.message);
        return;
    }

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        alert("保存失败：" + (text || response.status));
        return;
    }

    const result = await response.json();
    const heroId = result.id || id;

    // 如有图片要上传，再 POST 图片
    if (imageFile && heroId) {
        const fd = new FormData();
        fd.append('file', imageFile);
        try {
            const uploadResp = await fetch(`${STATIC_ORIGIN}/heroes/api/${heroId}/upload-image`, {
                method: "POST",
                body: fd
            });
            if (uploadResp.ok) {
                const { url: uploadedUrl } = await uploadResp.json();
                const finalUrl = uploadedUrl && uploadedUrl.startsWith('http')
                    ? uploadedUrl
                    : (uploadedUrl ? STATIC_ORIGIN + (uploadedUrl.startsWith('/') ? uploadedUrl : '/' + uploadedUrl) : "");

                // 更新前端隐藏字段与预览
                document.getElementById("heroImageUrlHidden").value = uploadedUrl || "";
                const imgEl = document.getElementById("hero-current-image");
                const imgBox = document.getElementById("hero-current-image-box");
                if (finalUrl) {
                    imgEl.src = finalUrl;
                    imgBox.style.display = "block";
                }

                // 如果上传接口不会自动更新后端 imageUrl，可尝试补打一条 PATCH 仅更新图片地址（容错，不影响页面流程）
                // 后端不支持 PATCH 时可忽略失败
                try {
                    await fetch(`${STATIC_ORIGIN}/heroes/api/${heroId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ imageUrl: uploadedUrl })
                    });
                } catch (_) { /* 忽略 */ }
            } else {
                alert("图片上传失败，但英雄数据已保存");
            }
        } catch (e) {
            alert("图片上传接口异常，但英雄数据已保存：" + e.message);
        }
    }

    hideHeroForm();
    loadHeroes();
}

// 编辑英雄，回填所有表单以及图片
async function editHero(id) {
    const response = await fetch(`${STATIC_ORIGIN}/heroes/api/${id}`);
    if (!response.ok) {
        alert("加载英雄详情失败");
        return;
    }
    const hero = await response.json();
    document.getElementById("heroId").value = hero.id;
    document.getElementById("hero-name").value = hero.name || "";
    document.getElementById("hero-alias").value = hero.alias || "";
    document.getElementById("hero-title").value = hero.title || "";
    document.getElementById("hero-category").value = hero.category || "";
    document.getElementById("hero-content").value = hero.content || "";
    document.getElementById("hero-gender").value = hero.gender || "";
    document.getElementById("hero-ethnicity").value = hero.ethnicity || "";
    document.getElementById("hero-birthDate").value = hero.birthDate || "";
    document.getElementById("hero-deathDate").value = hero.deathDate || "";
    document.getElementById("hero-birthplace").value = hero.birthplace || "";
    document.getElementById("hero-politicalStatus").value = hero.politicalStatus || "";
    document.getElementById("hero-description").value = hero.description || "";

    // ↓↓↓ 回填图片部分 ↓↓↓
    const imgUrl = hero.imageUrl ?? hero.image_url ?? "";
    document.getElementById("heroImageUrlHidden").value = imgUrl;
    const imgBox = document.getElementById("hero-current-image-box");
    const imgEl = document.getElementById("hero-current-image");
    if (imgUrl) {
        const resolvedImgUrl = imgUrl.startsWith('http') ? imgUrl : STATIC_ORIGIN + (imgUrl.startsWith('/') ? imgUrl : '/' + imgUrl);
        imgEl.src = resolvedImgUrl;
        imgEl.style.display = 'inline-block';
        imgBox.style.display = 'block';
        imgEl.onclick = () => previewImage(imgUrl, hero.name || "英雄图片");
    } else {
        imgEl.src = "";
        imgBox.style.display = 'none';
    }

    // 显示表单并修改标题
    document.getElementById("heroFormContainer").style.display = "block";
    document.getElementById("heroFormTitle").textContent = "编辑英雄";

    // 清空文件选择框（避免误判成“已选择新图”）
    const fileInput = document.getElementById("hero-image");
    if (fileInput) fileInput.value = "";
}

// 删除英雄
async function deleteHero(id) {
    if (!confirm("确定要删除这个英雄吗？")) return;
    const response = await fetch(`${STATIC_ORIGIN}/heroes/api/${id}`, { method: "DELETE" });
    if (response.ok) {
        alert("删除英雄成功！");
        loadHeroes();
    } else {
        alert("删除失败: " + (await response.text()));
    }
}

// 初始化
document.addEventListener("DOMContentLoaded", function () {
    const heroSection = document.getElementById("heroes");
    if (heroSection && heroSection.classList.contains("active")) {
        loadHeroes();
    }
});

// 导出供 HTML 调用
window.showHeroForm = showHeroForm;
window.hideHeroForm = hideHeroForm;
window.saveHero = saveHero;
window.editHero = editHero;
window.deleteHero = deleteHero;
window.loadHeroes = loadHeroes;