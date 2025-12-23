// 加载故事列表
function loadStories() {
    console.log("loadStories called");

    fetch("http://localhost:8080/api/admin/stories") // 指定完整后端地址，防止跨域路径错误
        .then(res => {
            if (!res.ok) throw new Error("网络错误，状态码：" + res.status);
            return res.json();
        })
        .then(data => {
            console.log("获取到的故事数据：", data);
            populateStoryTable(data);
        })
        .catch(err => {
            alert('加载故事失败: ' + err);
        });
}

// 填充故事表格
function populateStoryTable(stories) {
    const tbody = document.querySelector('#storyTable tbody');
    tbody.innerHTML = '';

    if (!stories || stories.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="6">暂无故事数据</td>`;
        tbody.appendChild(tr);
        return;
    }

    stories.forEach(story => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${story.id || ''}</td>
            <td>${escapeHTML(story.title)}</td>
            <td>${escapeHTML(story.summary || '')}</td>
            <td>${escapeHTML(story.location || '')}</td>
            <td>${escapeHTML(story.storyTime || '')}</td>
            <td>
                <button onclick="editStory(${story.id})">编辑</button>
                <button onclick="deleteStory(${story.id})">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 打开新增故事表单
function showStoryForm(isEdit = false, story = null) {
    const formContainer = document.getElementById("storyFormContainer");
    if (!formContainer) return;
    formContainer.style.display = "block";
    document.getElementById("storyFormTitle").textContent = isEdit ? "编辑故事" : "新增故事";
    document.getElementById("storyForm").reset();
    document.getElementById("storyId").value = story ? story.id : "";
    document.getElementById("story-title").value = story ? story.title : "";
    document.getElementById("story-content").value = story ? story.content : "";
    document.getElementById("story-source").value = story ? story.source : "";
    document.getElementById("story-summary").value = story ? story.summary : "";
    document.getElementById("story-storyTime").value = story ? story.storyTime : "";
    document.getElementById("story-location").value = story ? story.location : "";
    document.getElementById("story-heroName").value = story ? (story.heroName || '') : "";
    // 若需回显图片可扩展
}

// 隐藏表单
function hideStoryForm() {
    const formContainer = document.getElementById("storyFormContainer");
    formContainer.style.display = "none";
}

// 编辑故事
function editStory(id) {
    fetch("http://localhost:8080/api/admin/stories")
        .then(res => res.json())
        .then(data => {
            const story = data.find(s => s.id === id);
            if (story) {
                showStoryForm(true, story);
            }
        });
}

// 保存故事
function saveStory() {
    const id = document.getElementById("storyId").value;
    const title = document.getElementById("story-title").value.trim();
    const content = document.getElementById("story-content").value.trim();
    const source = document.getElementById("story-source").value.trim();
    const summary = document.getElementById("story-summary").value.trim();
    const storyTime = document.getElementById("story-storyTime").value.trim();
    const location = document.getElementById("story-location").value.trim();
    const heroName = document.getElementById("story-heroName").value.trim();
    const imageFile = document.getElementById("story-image").files[0];

    if (!title || !content) {
        alert("标题和内容必填！");
        return;
    }

    const storyData = {
        title,
        content,
        source,
        summary,
        storyTime,
        location,
        heroName
    };

    if (imageFile) {
        // 未实现图片上传接口的话，建议暂时不处理图片上传
        const fd = new FormData();
        Object.keys(storyData).forEach(key => {
            fd.append(key, storyData[key]);
        });
        fd.append("image", imageFile);

        const method = id ? "PUT" : "POST";
        const url = id ? `http://localhost:8080/api/admin/stories/${id}` : "http://localhost:8080/api/admin/stories";
        fetch(url, {
            method,
            body: fd
        })
            .then(res => {
                if (!res.ok) throw new Error("网络错误");
                return res.json();
            })
            .then(() => {
                hideStoryForm();
                loadStories();
            })
            .catch(err => alert("保存失败: " + err));
        return;
    } else {
        // 只发送JSON（无图片时）
        const method = id ? "PUT" : "POST";
        const url = id ? `http://localhost:8080/api/admin/stories/${id}` : "http://localhost:8080/api/admin/stories";
        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(storyData)
        })
            .then(res => {
                if (!res.ok) throw new Error("网络错误");
                return res.json();
            })
            .then(() => {
                hideStoryForm();
                loadStories();
            })
            .catch(err => alert("保存失败: " + err));
    }
}

// 删除故事
function deleteStory(id) {
    if (!confirm("确定要删除该故事吗？")) return;
    fetch(`http://localhost:8080/api/admin/stories/${id}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) throw new Error("删除失败");
            loadStories();
        })
        .catch(err => alert("删除失败: " + err));
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

// 页面加载完成自动加载故事
document.addEventListener("DOMContentLoaded", loadStories);