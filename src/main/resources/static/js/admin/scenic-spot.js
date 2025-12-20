async function loadScenicSpots() {
    const response = await fetch("http://localhost:8080/api/scenicspots");
    const spots = await response.json();
    const scenicTableBody = document.querySelector("#scenicTable tbody");

    scenicTableBody.innerHTML = ""; // 清空旧表格内容

    spots.forEach(spot => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${spot.id}</td>
            <td>${spot.name}</td>
            <td>${spot.location}</td>
            <td>${spot.description || "暂无简介"}</td>
            <td><img src="${spot.imageUrl || '#'}" alt="圣地图片" width="50"></td>
            <td>
                <button onclick="editScenic(${spot.id})">编辑</button>
                <button onclick="deleteScenic(${spot.id})">删除</button>
            </td>
        `;
        scenicTableBody.appendChild(row);
    });
}
// 显示新增圣地表单
function showScenicForm() {
    const formContainer = document.getElementById("scenicFormContainer");
    formContainer.style.display = "block"; // 显示表单
    document.getElementById("scenicFormTitle").textContent = "新增圣地"; // 设置标题为"新增圣地"
    document.getElementById("scenicForm").reset(); // 清空表单
}

// 隐藏新增圣地表单
function hideScenicForm() {
    const formContainer = document.getElementById("scenicFormContainer");
    formContainer.style.display = "none"; // 隐藏表单
}

// 保存圣地信息（新增或编辑）
async function saveScenic() {
    console.log("saveScenic() 已被执行！");
    const name = document.getElementById("scenic-name").value;
    const location = document.getElementById("scenic-location").value;
    const description = document.getElementById("scenic-description").value;
    const imageFile = document.getElementById("scenic-image").files[0];

    if (!name || !location) {
        alert("名称和地点为必填项！");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    const response = await fetch("http://localhost:8080/api/admin/scenicspots", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        alert("新增圣地成功！");
        hideScenicForm();
        loadScenicSpots(); // 刷新圣地列表
    } else {
        alert("保存失败，请检查！");
    }
}