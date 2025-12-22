// 显示新增故事表单
function showStoryForm() {
    const formContainer = document.getElementById("storyFormContainer");
    if (!formContainer) return;
    formContainer.style.display = "block";
    document.getElementById("storyFormTitle").textContent = "新增百科";
    document.getElementById("storyForm").reset();
    document.getElementById("storyId").value = "";// 清空隐藏的ID
}
// 隐藏新增故事表单
function hideStoryForm() {
    const formContainer = document.getElementById("storyFormContainer");
    formContainer.style.display = "none";
}