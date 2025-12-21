// 显示新增活动表单
function showExploreForm() {
    const formContainer = document.getElementById("exploreFormContainer");
    if (!formContainer) return;
    formContainer.style.display = "block";
    document.getElementById("exploreFormTitle").textContent = "新增百科";
    document.getElementById("exploreForm").reset();
    document.getElementById("exploreId").value = "";// 清空隐藏的ID
}
// 隐藏新增活动表单
function hideExploreForm() {
    const formContainer = document.getElementById("exploreFormContainer");
    formContainer.style.display = "none";
}