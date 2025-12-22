// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const registerLink = document.getElementById('registerLink');

    // 从本地存储加载保存的用户名和记住我状态
    loadSavedCredentials();

    // 切换密码显示/隐藏
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // 切换图标
        const icon = this.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            this.setAttribute('title', '显示密码');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            this.setAttribute('title', '隐藏密码');
        }
    });

    // 表单提交处理
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // 获取表单数据
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const rememberMe = rememberMeCheckbox.checked;

        // 清除之前的错误
        clearAllErrors();

        // 验证表单
        if (!validateForm(username, password)) {
            return;
        }

        // 保存登录状态（如果用户选择记住我）
        if (rememberMe) {
            localStorage.setItem('rememberedUsername', username);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberMe');
        }

        // 执行登录
        performLogin(username, password);
    });

    // 重置按钮事件
    loginForm.addEventListener('reset', function() {
        setTimeout(() => {
            clearAllErrors();
            usernameInput.focus();
        }, 0);
    });

    // 注册链接点击事件
    registerLink.addEventListener('click', function(event) {
        event.preventDefault();
        // 直接跳转到注册页面
        window.location.href = 'register.html';
    });

    // 忘记密码链接
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        const username = usernameInput.value.trim();

        if (!username) {
            showError(usernameInput, '请输入用户名或手机号以找回密码');
            return;
        }

        alert(`已向 ${username} 发送密码重置链接，请查收邮件或短信。`);
    });

    // 表单验证函数
    function validateForm(username, password) {
        let isValid = true;

        // 检查用户名是否为空
        if (!username) {
            showError(usernameInput, '请输入用户名或手机号');
            isValid = false;
        } else if (username.length < 2) {
            showError(usernameInput, '用户名至少2个字符');
            isValid = false;
        }

        // 检查密码是否为空
        if (!password) {
            showError(passwordInput, '请输入密码');
            isValid = false;
        } else if (password.length < 8 || password.length > 24) {
            showError(passwordInput, '密码长度应在8-24个字符之间');
            isValid = false;
        }

        return isValid;
    }

    // 显示错误信息
    function showError(inputElement, message) {
        // 移除之前的错误提示
        const existingError = inputElement.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // 添加错误样式
        inputElement.style.borderColor = '#e74c3c';
        inputElement.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';

        // 创建错误消息元素
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

        // 插入错误消息
        inputElement.parentNode.appendChild(errorElement);

        // 输入时移除错误样式
        const clearError = function() {
            inputElement.style.borderColor = '#ddd';
            inputElement.style.boxShadow = 'none';
            if (errorElement.parentNode) {
                errorElement.remove();
            }
            inputElement.removeEventListener('input', clearError);
        };

        inputElement.addEventListener('input', clearError);

        // 聚焦到错误字段
        inputElement.focus();
    }

    // 清除所有错误
    function clearAllErrors() {
        // 移除所有错误消息
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });

        // 重置输入框样式
        document.querySelectorAll('.form-group input').forEach(input => {
            input.style.borderColor = '#ddd';
            input.style.boxShadow = 'none';
        });
    }

    // 执行登录
    function performLogin(username, password) {
        // 显示加载状态
        const submitBtn = loginForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
        submitBtn.disabled = true;

        // 准备请求数据
        const requestData = {
            username: username,
            password: password,
            rememberMe: rememberMeCheckbox.checked
        };

        // 发送POST请求到后端API
        fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // 登录成功
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> 登录成功';
                    submitBtn.style.background = 'linear-gradient(to right, #27ae60, #219653)';

                    // 保存token到本地存储
                    localStorage.setItem('authToken', data.data.token);
                    localStorage.setItem('userInfo', JSON.stringify(data.data.user));

                    // 显示成功消息
                    showSuccessMessage(`欢迎回来，${data.data.user.username}！`);

                    // 2秒后跳转到首页
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 2000);
                } else {
                    // 登录失败
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // 显示错误信息
                    showError(passwordInput, data.message);
                }
            })
            .catch(error => {
                // 网络错误
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showError(passwordInput, '网络错误，请检查网络连接');
                console.error('登录错误:', error);
            });
    }

    // 显示成功消息
    function showSuccessMessage(message) {
        // 创建成功消息元素
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.style.backgroundColor = '#d4edda';
        successElement.style.color = '#155724';
        successElement.style.padding = '15px';
        successElement.style.borderRadius = '6px';
        successElement.style.marginBottom = '20px';
        successElement.style.border = '1px solid #c3e6cb';
        successElement.style.textAlign = 'center';
        successElement.style.animation = 'fadeIn 0.5s ease';
        successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

        // 插入到表单前
        const loginHeader = document.querySelector('.login-header');
        loginHeader.parentNode.insertBefore(successElement, loginHeader.nextSibling);

        // 3秒后移除成功消息
        setTimeout(() => {
            if (successElement.parentNode) {
                successElement.style.opacity = '0';
                successElement.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    if (successElement.parentNode) {
                        successElement.remove();
                    }
                }, 500);
            }
        }, 3000);
    }

    // 从本地存储加载保存的凭据
    function loadSavedCredentials() {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        const rememberMe = localStorage.getItem('rememberMe');

        if (rememberedUsername && rememberMe === 'true') {
            usernameInput.value = rememberedUsername;
            rememberMeCheckbox.checked = true;
        }
    }

    // 添加输入框焦点效果
    const formInputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // 初始动画效果
    const loginBox = document.querySelector('.login-box');
    loginBox.style.opacity = '0';
    loginBox.style.transform = 'translateY(30px) scale(0.95)';

    setTimeout(() => {
        loginBox.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        loginBox.style.opacity = '1';
        loginBox.style.transform = 'translateY(0) scale(1)';
    }, 200);

    // 自动聚焦到用户名输入框
    if (!usernameInput.value) {
        setTimeout(() => {
            usernameInput.focus();
        }, 500);
    }
});