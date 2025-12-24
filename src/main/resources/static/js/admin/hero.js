// ========================== 英雄管理 ==========================

// 静态资源访问基址
const STATIC_ORIGIN = (location.port === '8080' || location.origin.includes('localhost:8080'))
    ? location.origin
    : 'http://localhost:8080';

// 预览图片弹窗（公用）
function previewImage(url, name) {
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('previewImage');
    const title = document.getElementById('previewTitle');
    if (!modal || !img || !url) return;
    img.onerror = null;
    img.src = /^https?:\/\//.test(url) ? url : STATIC_ORIGIN + (url.startsWith('/') ? url : '/' + url);
    title.textContent = name || '图片预览';
    modal.classList.add('active');
    img.onerror = function () {
        closeImagePreview();
        alert('图片加载失败!');
    };
}
function closeImagePreview() {
    document.getElementById('imagePreviewModal').classList.remove('active');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeImagePreview(); });
window.previewImage = previewImage;
window.closeImagePreview = closeImagePreview;

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
            const imgHtml = imgUrl
                ? `<img src="${imgUrl.startsWith('http')?imgUrl:STATIC_ORIGIN+(imgUrl.startsWith('/')?imgUrl:'/'+imgUrl)}" style="width:40px;cursor:pointer;border-radius:3px;" onclick="previewImage('${imgUrl}','${hero.name||'英雄图片'}')">`
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

// 保存英雄信息
async function saveHero() {
    const id = document.getElementById("heroId").value;
    const name = document.getElementById("hero-name").value.trim();
    const imageFile = document.getElementById("hero-image").files[0];

    if (!name) {
        alert("英雄姓名为必填项！");
        return;
    }
    // 填充所有你表单上的字段
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
        deathDate: document.getElementById("hero-deathDate").value,
        imageUrl: "" // 创建时为空
    };
    // 先保存英雄信息
    const method = id ? "PUT" : "POST";
    const url = id
        ? `${STATIC_ORIGIN}/heroes/api/${id}`
        : `${STATIC_ORIGIN}/heroes/api`;
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroData)
    });
    if (!response.ok) {
        alert("保存失败");
        return;
    }
    const result = await response.json();
    const heroId = result.id || id;
    // 如有图片要上传，再POST图片
    if (imageFile && heroId) {
        const fd = new FormData();
        fd.append('file', imageFile);
        const uploadResp = await fetch(`${STATIC_ORIGIN}/heroes/api/${heroId}/upload-image`, {
            method: "POST",
            body: fd
        });
        if (uploadResp.ok) {
            const { url } = await uploadResp.json();
            document.getElementById("heroImageUrlHidden").value = url;
            document.getElementById("hero-current-image").src = url.startsWith('http') ? url : STATIC_ORIGIN + url;
            document.getElementById("hero-current-image-box").style.display = "block";
        } else {
            alert("图片上传失败，但英雄数据已保存");
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
        imgEl.src = imgUrl.startsWith('http') ? imgUrl : STATIC_ORIGIN + (imgUrl.startsWith('/')?imgUrl:'/'+imgUrl);
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

// 搜索英雄（如有搜索框自行补全）

// 初始化
document.addEventListener("DOMContentLoaded", function () {
    const heroSection = document.getElementById("heroes");
    if (heroSection && heroSection.classList.contains("active")) {
        loadHeroes();
    }
    // 监听等略...
});

// 导出供 HTML 调用
window.showHeroForm = showHeroForm;
window.hideHeroForm = hideHeroForm;
window.saveHero = saveHero;
window.editHero = editHero;
window.deleteHero = deleteHero;
window.loadHeroes = loadHeroes;