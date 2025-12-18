// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取表单和输入元素
    const registerForm = document.getElementById('registerForm');
    const resetBtn = document.getElementById('resetBtn');

    const phoneInput = document.getElementById('phone');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // 表单提交事件
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表单默认提交

        // 清除之前的错误信息
        clearErrors();

        // 验证表单
        const isValid = validateForm();

        if (isValid) {
            // 表单验证通过，模拟提交
            simulateFormSubmit();
        }
    });

    // 重置按钮事件
    resetBtn.addEventListener('click', function() {
        clearForm();
        clearErrors();
        showMessage('表单已重置', 'info');
    });

    // 实时验证输入
    phoneInput.addEventListener('blur', validatePhone);
    usernameInput.addEventListener('blur', validateUsername);
    passwordInput.addEventListener('blur', validatePassword);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

    // 验证手机号
    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phoneError = document.getElementById('phoneError');

        if (!phone) {
            phoneError.textContent = '手机号不能为空';
            return false;
        }

        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            phoneError.textContent = '请输入有效的11位手机号码';
            return false;
        }

        return true;
    }

    // 验证用户名
    function validateUsername() {
        const username = usernameInput.value.trim();
        const usernameError = document.getElementById('usernameError');

        if (!username) {
            usernameError.textContent = '用户名不能为空';
            return false;
        }

        if (username.length < 2 || username.length > 20) {
            usernameError.textContent = '用户名长度应为2-20个字符';
            return false;
        }

        // 允许中文、字母、数字和下划线
        const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            usernameError.textContent = '用户名只能包含中文、字母、数字和下划线';
            return false;
        }

        return true;
    }

    // 验证密码
    function validatePassword() {
        const password = passwordInput.value;
        const passwordError = document.getElementById('passwordError');

        if (!password) {
            passwordError.textContent = '密码不能为空';
            return false;
        }

        if (password.length < 8 || password.length > 24) {
            passwordError.textContent = '密码长度应为8-24个字符';
            return false;
        }

        // 必须包含字母和数字
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);

        if (!hasLetter || !hasNumber) {
            passwordError.textContent = '密码必须包含字母和数字';
            return false;
        }

        return true;
    }

    // 验证确认密码
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        if (!confirmPassword) {
            confirmPasswordError.textContent = '请再次输入密码';
            return false;
        }

        if (password !== confirmPassword) {
            confirmPasswordError.textContent = '两次输入的密码不一致';
            return false;
        }

        return true;
    }

    // 验证整个表单
    function validateForm() {
        const isPhoneValid = validatePhone();
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        return isPhoneValid && isUsernameValid && isPasswordValid && isConfirmPasswordValid;
    }

    // 清除所有错误信息
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }

    // 清除表单
    function clearForm() {
        registerForm.reset();
    }

    // 模拟表单提交
    function simulateFormSubmit() {
        // 显示加载状态
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
        submitBtn.disabled = true;

        // 模拟API请求延迟
        setTimeout(() => {
            // 恢复按钮状态
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // 显示成功消息
            showMessage('注册成功！正在跳转到首页...', 'success');

            // 模拟跳转
            setTimeout(() => {
                // 在实际应用中，这里会进行页面跳转
                // window.location.href = 'index.html';

                // 这里只是演示，实际使用时请取消上面的注释
                console.log('跳转到首页');
                alert('注册成功！在实际应用中，这里会跳转到首页。');
                clearForm();
            }, 1500);
        }, 2000);
    }

    // 显示消息提示
    function showMessage(message, type) {
        // 移除已有的消息提示
        const existingMessage = document.querySelector('.message-alert');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = `message-alert message-${type}`;
        messageElement.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            ${message}
        `;

        // 添加到页面
        document.querySelector('.register-card').prepend(messageElement);

        // 3秒后自动移除
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 3000);
    }

    // 添加消息提示的CSS
    const style = document.createElement('style');
    style.textContent = `
        .message-alert {
            padding: 12px 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
        }
        
        .message-success {
            background-color: #e8f5e9;
            color: #2e7d32;
            border-left: 4px solid #4caf50;
        }
        
        .message-info {
            background-color: #e3f2fd;
            color: #1565c0;
            border-left: 4px solid #2196f3;
        }
        
        .message-alert i {
            margin-right: 10px;
            font-size: 18px;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});