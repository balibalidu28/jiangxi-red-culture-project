// 显示新增百科表单
function showEncyclopediaForm() {
    const formContainer = document.getElementById("encyclopediaFormContainer");
    if (!formContainer) return;
    formContainer.style.display = "block";
    document.getElementById("encyclopediaFormTitle").textContent = "新增百科";
    document.getElementById("encyclopediaForm").reset();
    document.getElementById("encyclopediaId").value = ""; // 清空隐藏的ID
}
// 隐藏新增百科表单
function hideEncyclopediaForm() {
    const formContainer = document.getElementById("encyclopediaFormContainer");
    formContainer.style.display = "none";
}