// 显示新增英雄表单
function showHeroForm() {
    const formContainer = document.getElementById("heroFormContainer");
    if (!formContainer) return;
    formContainer.style.display = "block";
    document.getElementById("heroFormTitle").textContent = "新增百科";
    document.getElementById("heroForm").reset();
    document.getElementById("heroId").value = "";// 清空隐藏的ID
}
// 隐藏新增英雄表单
function hideHeroForm() {
    const formContainer = document.getElementById("heroFormContainer");
    formContainer.style.display = "none";
}