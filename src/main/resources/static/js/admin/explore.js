// ========================== 活动管理 ==========================

// ------- schedule(可视化日程) 内存结构 -------
let scheduleItems = []; // 每一项: { dayTitle, startTime, endTime, content }

// ===================== 上传：活动图片 =====================
async function uploadExploreImage(exploreId, imageFile) {
    const fd = new FormData();
    fd.append("file", imageFile);

    const resp = await fetch(`${STATIC_ORIGIN}/api/admin/explore/${exploreId}/upload-image`, {
        method: "POST",
        body: fd
    });

    if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`图片上传失败：${text || resp.status}`);
    }
    return await resp.json(); // {url, success}
}

// ===================== 上传：报名表文件 =====================
async function uploadExploreRegistrationForm(exploreId, regFile) {
    const fd = new FormData();
    fd.append("file", regFile);

    const resp = await fetch(`${STATIC_ORIGIN}/api/admin/explore/${exploreId}/upload-registration-form`, {
        method: "POST",
        body: fd
    });

    if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`报名表上传失败：${text || resp.status}`);
    }
    return await resp.json(); // {url, success}
}

// ===================== 表单显示/隐藏 =====================

// 显示新增活动表单
function showExploreForm() {
    const box = document.getElementById("exploreFormContainer");
    box.style.display = "block";
    document.getElementById("exploreFormTitle").textContent = "新增活动";
    document.getElementById("exploreForm").reset();

    document.getElementById("exploreId").value = "";
    document.getElementById("exploreImageUrlHidden").value = "";
    document.getElementById("exploreRegistrationFormUrlHidden").value = "";

    // 清空图片预览
    const imgEl = document.getElementById("explore-current-image");
    const imgBox = document.getElementById("explore-current-image-box");
    if (imgEl) imgEl.src = "";
    if (imgBox) imgBox.style.display = "none";

    // 清空报名表预览
    const regBox = document.getElementById("explore-current-registration-box");
    if (regBox) regBox.style.display = "none";

    // 清空 file input
    const imgInput = document.getElementById("explore-image");
    if (imgInput) imgInput.value = "";
    const regInput = document.getElementById("explore-registration-file");
    if (regInput) regInput.value = "";

    // 清空日程
    scheduleItems = [];
    renderScheduleItems();
}

// 隐藏表单
function hideExploreForm() {
    document.getElementById("exploreFormContainer").style.display = "none";
}

// ===================== 列表加载 =====================

// 加载活动列表（后台管理列表渲染）
async function loadExplores() {
    const url = STATIC_ORIGIN + "/explore/api";
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP错误! 状态: ${resp.status}`);
        const list = await resp.json();

        const tbody = document.getElementById("exploreTableBody");
        if (!tbody) return;
        tbody.innerHTML = "";

        list.forEach(item => {
            const imgUrl = item.image || "";
            const resolvedImgUrl = imgUrl ? assetUrl(imgUrl) : "";
            const imgHtml = resolvedImgUrl
                ? `<img src="${resolvedImgUrl}" style="width:40px;cursor:pointer;border-radius:3px;" onclick="previewImage('${imgUrl}','${escapeHtml(item.title || '活动图片')}')">`
                : `<span style="color:#aaa;">无</span>`;

            const regUrl = item.registrationForm || "";
            const regHtml = regUrl
                ? `<a href="${assetUrl(regUrl)}" target="_blank" rel="noopener noreferrer">查看</a>`
                : `<span style="color:#aaa;">无</span>`;

            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${item.id}</td>
              <td>${escapeHtml(item.title || "未命名")}</td>
              <td>${escapeHtml(item.city || "-")}</td>
              <td>${fmtDateTime(item.startTime)} ~ ${fmtDateTime(item.endTime)}</td>
              <td>${escapeHtml(item.location || "-")}</td>
              <td>${escapeHtml(item.status || "-")}</td>
              <td>${imgHtml}</td>
              <td>${regHtml}</td>
              <td>
                <button onclick="editExplore(${item.id})">编辑</button>
                <button onclick="deleteExplore(${item.id})">删除</button>
              </td>
            `;
            tbody.appendChild(row);
        });
    } catch (e) {
        alert("加载活动列表失败: " + e.message);
    }
}

// ===================== 保存（新增/编辑） =====================

async function saveExplore() {
    const id = (document.getElementById("exploreId").value || "").trim();

    const title = document.getElementById("explore-title").value.trim();
    const city = document.getElementById("explore-city").value.trim();
    const locationStr = document.getElementById("explore-location").value.trim();
    const startTime = document.getElementById("explore-start-time").value; // datetime-local
    const endTime = document.getElementById("explore-end-time").value;     // datetime-local
    const organization = document.getElementById("explore-organization").value.trim();
    const registrationEmail = document.getElementById("explore-registration-email").value.trim();
    const registrationDeadline = document.getElementById("explore-registration-deadline").value; // date
    const maxParticipants = Number(document.getElementById("explore-max-participants").value || 50);
    const status = (document.getElementById("explore-status").value || "").trim(); // upcoming/ongoing/ended
    const description = document.getElementById("explore-description").value;

    // 图片
    const imageFile = document.getElementById("explore-image").files[0];
    const existingImageUrl = (document.getElementById("exploreImageUrlHidden").value || "").trim();

    // 报名表
    const regFile = document.getElementById("explore-registration-file").files[0];
    const existingRegUrl = (document.getElementById("exploreRegistrationFormUrlHidden").value || "").trim();

    // 基本校验
    if (!title) return alert("活动标题为必填项！");
    if (!city) return alert("所在城市为必填项！");
    if (!locationStr) return alert("活动地点为必填项！");
    if (!startTime) return alert("开始时间为必填项！");
    if (!endTime) return alert("结束时间为必填项！");
    if (!organization) return alert("主办单位为必填项！");
    if (!registrationEmail) return alert("报名邮箱为必填项！");
    if (!registrationDeadline) return alert("报名截止日期为必填项！");

    // schedule：保存成 JSON 字符串（你实体 schedule 是 String）
    const scheduleJson = JSON.stringify(scheduleItems || []);

    const payload = {
        title,
        city,
        location: locationStr,
        startTime: toIsoLocalDateTime(startTime),
        endTime: toIsoLocalDateTime(endTime),
        organization,
        registrationEmail,
        registrationDeadline,
        maxParticipants,
        status: status ? status.toUpperCase() : undefined, // UPCOMING/ONGOING/ENDED
        description,
        schedule: scheduleJson
        // image/registrationForm：由下面策略决定是否传
    };

    // 编辑：没选新文件就保留旧值（避免被覆盖为空）
    if (id) {
        if (!imageFile && existingImageUrl) payload.image = existingImageUrl;
        if (!regFile && existingRegUrl) payload.registrationForm = existingRegUrl;
    }

    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    const isEdit = !!id;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
        ? `${STATIC_ORIGIN}/api/admin/explore/${id}`
        : `${STATIC_ORIGIN}/api/admin/explore`;

    let resp;
    try {
        resp = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        alert("保存失败：" + e.message);
        return;
    }

    if (!resp.ok) {
        alert("保存失败：" + (await resp.text().catch(() => "") || resp.status));
        return;
    }

    const saved = await resp.json().catch(() => ({}));
    const exploreId = saved.id || id;

    // 1) 上传图片（如果选了新图）
    if (imageFile && exploreId) {
        try {
            const result = await uploadExploreImage(exploreId, imageFile);
            const uploadedUrl = result.url || "";
            document.getElementById("exploreImageUrlHidden").value = uploadedUrl;

            // 更新预览
            const imgEl = document.getElementById("explore-current-image");
            const imgBox = document.getElementById("explore-current-image-box");
            if (uploadedUrl) {
                imgEl.src = assetUrl(uploadedUrl);
                imgBox.style.display = "block";
            }
        } catch (e) {
            alert("图片上传失败，但活动数据已保存：" + e.message);
        }
    }

    // 2) 上传报名表（如果选了新文件）
    if (regFile && exploreId) {
        try {
            const result = await uploadExploreRegistrationForm(exploreId, regFile);
            const uploadedUrl = result.url || "";
            document.getElementById("exploreRegistrationFormUrlHidden").value = uploadedUrl;

            // 更新预览
            const regBox = document.getElementById("explore-current-registration-box");
            const regLink = document.getElementById("explore-current-registration-link");
            if (uploadedUrl) {
                regLink.href = assetUrl(uploadedUrl);
                regBox.style.display = "block";
            }
        } catch (e) {
            alert("报名表上传失败，但活动数据已保存：" + e.message);
        }
    }

    hideExploreForm();
    loadExplores();
}

// ===================== 编辑/删除 =====================

// 编辑活动：回填表单 + 回显图片/报名表 + schedule
async function editExplore(id) {
    const resp = await fetch(`${STATIC_ORIGIN}/explore/api/${id}`);
    if (!resp.ok) return alert("加载活动详情失败");
    const item = await resp.json();

    document.getElementById("exploreId").value = item.id;
    document.getElementById("explore-title").value = item.title || "";
    document.getElementById("explore-city").value = item.city || "";
    document.getElementById("explore-location").value = item.location || "";
    document.getElementById("explore-start-time").value = fromIsoToDatetimeLocal(item.startTime);
    document.getElementById("explore-end-time").value = fromIsoToDatetimeLocal(item.endTime);
    document.getElementById("explore-organization").value = item.organization || "";
    document.getElementById("explore-registration-email").value = item.registrationEmail || "";
    document.getElementById("explore-registration-deadline").value = item.registrationDeadline || "";
    document.getElementById("explore-max-participants").value = item.maxParticipants ?? 50;

    document.getElementById("explore-status").value = (item.status || "UPCOMING").toLowerCase();
    document.getElementById("explore-description").value = item.description || "";

    // 图片回显
    const imgUrl = item.image || "";
    document.getElementById("exploreImageUrlHidden").value = imgUrl;

    const imgBox = document.getElementById("explore-current-image-box");
    const imgEl = document.getElementById("explore-current-image");
    if (imgUrl) {
        imgEl.src = assetUrl(imgUrl);
        imgBox.style.display = "block";
        imgEl.onclick = () => previewImage(imgUrl, item.title || "活动图片");
    } else {
        imgEl.src = "";
        imgBox.style.display = "none";
    }

    // 报名表回显
    const regUrl = item.registrationForm || "";
    document.getElementById("exploreRegistrationFormUrlHidden").value = regUrl;
    const regBox = document.getElementById("explore-current-registration-box");
    const regLink = document.getElementById("explore-current-registration-link");
    if (regUrl) {
        regLink.href = assetUrl(regUrl);
        regBox.style.display = "block";
    } else {
        regBox.style.display = "none";
    }

    // schedule 回填
    scheduleItems = parseSchedule(item.schedule);
    renderScheduleItems();

    document.getElementById("exploreFormContainer").style.display = "block";
    document.getElementById("exploreFormTitle").textContent = "编辑活动";

    // 清空 file input，避免误判
    const imgInput = document.getElementById("explore-image");
    if (imgInput) imgInput.value = "";
    const regInput = document.getElementById("explore-registration-file");
    if (regInput) regInput.value = "";
}

// 删除活动
async function deleteExplore(id) {
    if (!confirm("确定要删除这个活动吗？")) return;
    const resp = await fetch(`${STATIC_ORIGIN}/api/admin/explore/${id}`, { method: "DELETE" });
    if (resp.ok) {
        alert("删除活动成功！");
        loadExplores();
    } else {
        alert("删除失败: " + (await resp.text().catch(() => "") || resp.status));
    }
}

// ===================== schedule UI =====================

function addScheduleItem() {
    const dayTitle = (document.getElementById("schedule-title").value || "").trim();
    const startTime = (document.getElementById("schedule-start-time").value || "").trim();
    const endTime = (document.getElementById("schedule-end-time").value || "").trim();
    const content = (document.getElementById("schedule-content").value || "").trim();

    if (!dayTitle && !startTime && !endTime && !content) {
        alert("请填写至少一项日程信息");
        return;
    }

    scheduleItems.push({ dayTitle, startTime, endTime, content });

    document.getElementById("schedule-title").value = "";
    document.getElementById("schedule-start-time").value = "";
    document.getElementById("schedule-end-time").value = "";
    document.getElementById("schedule-content").value = "";

    renderScheduleItems();
}

function removeScheduleItem(index) {
    scheduleItems.splice(index, 1);
    renderScheduleItems();
}

function renderScheduleItems() {
    const container = document.getElementById("schedule-items-container");
    if (!container) return;

    container.innerHTML = "";
    scheduleItems.forEach((it, idx) => {
        const row = document.createElement("div");
        row.style.cssText = "display:grid;grid-template-columns:1fr 2fr 2fr 2fr auto;gap:8px;padding:8px;border:1px solid #f0e0e0;border-radius:4px;margin-bottom:8px;background:#fff;";
        row.innerHTML = `
          <div>${escapeHtml(it.dayTitle || "-")}</div>
          <div>${escapeHtml(it.startTime || "-")}</div>
          <div>${escapeHtml(it.endTime || "-")}</div>
          <div>${escapeHtml(it.content || "-")}</div>
          <div><button type="button" onclick="removeScheduleItem(${idx})" style="background:#e53935;padding:4px 8px;font-size:.85rem;">删除</button></div>
        `;
        container.appendChild(row);
    });
}

// 清除报名表（只清UI/隐藏字段，不删后端文件）
function clearRegistrationFile() {
    document.getElementById("exploreRegistrationFormUrlHidden").value = "";
    const regBox = document.getElementById("explore-current-registration-box");
    if (regBox) regBox.style.display = "none";
    const regInput = document.getElementById("explore-registration-file");
    if (regInput) regInput.value = "";
}

// ===================== 工具函数 =====================

function parseSchedule(schedule) {
    if (!schedule) return [];
    if (Array.isArray(schedule)) return schedule;
    if (typeof schedule === "string") {
        try {
            const parsed = JSON.parse(schedule);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
}

function toIsoLocalDateTime(dtLocal) {
    if (!dtLocal) return dtLocal;
    return dtLocal.length === 16 ? dtLocal + ":00" : dtLocal;
}

function fromIsoToDatetimeLocal(iso) {
    if (!iso) return "";
    return iso.length >= 16 ? iso.substring(0, 16) : iso;
}

function fmtDateTime(v) {
    if (!v) return "-";
    return String(v).replace("T", " ").substring(0, 16);
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// 初始化：如果 explore 模块初始 active，则加载
document.addEventListener("DOMContentLoaded", function () {
    const sec = document.getElementById("explore");
    if (sec && sec.classList.contains("active")) {
        loadExplores();
    }
});

// 导出给 HTML onclick
window.showExploreForm = showExploreForm;
window.hideExploreForm = hideExploreForm;
window.loadExplores = loadExplores;
window.saveExplore = saveExplore;
window.editExplore = editExplore;
window.deleteExplore = deleteExplore;

window.addScheduleItem = addScheduleItem;
window.removeScheduleItem = removeScheduleItem;
window.clearRegistrationFile = clearRegistrationFile;