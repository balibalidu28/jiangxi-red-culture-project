// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const registerForm = document.getElementById('registerForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const phoneInput = document.getElementById('phone');
    const usernameInput = document.getElementById('username');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const loginLink = document.getElementById('loginLink');
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const passwordStrengthBar = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('strengthText');

    // 密码强度指示器父元素
    const passwordStrengthContainer = document.querySelector('.password-strength');

    // 初始动画效果
    const registerBox = document.querySelector('.register-box');
    registerBox.style.opacity = '0';
    registerBox.style.transform = 'translateY(30px) scale(0.95)';

    setTimeout(() => {
        registerBox.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        registerBox.style.opacity = '1';
        registerBox.style.transform = 'translateY(0) scale(1)';
    }, 200);

    // 自动聚焦到手机号输入框
    setTimeout(() => {
        phoneInput.focus();
    }, 500);

    // 切换密码显示/隐藏
    togglePasswordBtn.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, this);
    });

    toggleConfirmPasswordBtn.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, this);
    });

    // 密码输入时检查强度
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });

    // 表单提交处理
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // 获取表单数据
        const phone = phoneInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const agreeTerms = agreeTermsCheckbox.checked;

        // 清除之前的错误
        clearAllErrors();

        // 验证表单
        if (!validateForm(phone, username, password, confirmPassword, agreeTerms)) {
            return;
        }

        // 执行注册
        performRegistration(phone, username, password);
    });

    // 重置按钮事件
    registerForm.addEventListener('reset', function() {
        setTimeout(() => {
            clearAllErrors();
            phoneInput.focus();
            resetPasswordStrength();
        }, 0);
    });

    // 登录链接点击事件
    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'login.html';
    });

    // 用户协议链接
    termsLink.addEventListener('click', function(event) {
        event.preventDefault();
        showModal('用户服务协议', '请仔细阅读《江西红色文化信息网用户服务协议》内容...');
    });

    // 隐私政策链接
    privacyLink.addEventListener('click', function(event) {
        event.preventDefault();
        showModal('隐私政策', '请仔细阅读《江西红色文化信息网隐私政策》内容...');
    });

    // 切换密码可见性
    function togglePasswordVisibility(passwordField, toggleButton) {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);

        // 切换图标
        const icon = toggleButton.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            toggleButton.setAttribute('title', '显示密码');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            toggleButton.setAttribute('title', '隐藏密码');
        }
    }

    // 检查密码强度
    function checkPasswordStrength(password) {
        let strength = 0;
        let text = '密码强度：弱';

        // 重置样式
        passwordStrengthContainer.className = 'password-strength strength-weak';

        if (password.length === 0) {
            strengthText.textContent = '请输入密码';
            passwordStrengthBar.style.width = '0%';
            return;
        }

        // 长度评分
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;

        // 包含数字
        if (/\d/.test(password)) strength += 1;

        // 包含小写字母
        if (/[a-z]/.test(password)) strength += 1;

        // 包含大写字母
        if (/[A-Z]/.test(password)) strength += 1;

        // 包含特殊字符
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // 根据强度设置显示
        if (strength <= 2) {
            text = '密码强度：弱';
            passwordStrengthContainer.className = 'password-strength strength-weak';
            passwordStrengthBar.style.width = '30%';
        } else if (strength <= 4) {
            text = '密码强度：中';
            passwordStrengthContainer.className = 'password-strength strength-medium';
            passwordStrengthBar.style.width = '60%';
        } else {
            text = '密码强度：强';
            passwordStrengthContainer.className = 'password-strength strength-strong';
            passwordStrengthBar.style.width = '90%';
        }

        strengthText.textContent = text;
    }

    // 重置密码强度显示
    function resetPasswordStrength() {
        passwordStrengthContainer.className = 'password-strength';
        passwordStrengthBar.style.width = '0%';
        strengthText.textContent = '密码强度：弱';
    }

    // 表单验证函数
    function validateForm(phone, username, password, confirmPassword, agreeTerms) {
        let isValid = true;

        // 验证手机号
        if (!phone) {
            showError(phoneInput, '请输入手机号');
            isValid = false;
        } else if (!/^1[3-9]\d{9}$/.test(phone)) {
            showError(phoneInput, '请输入有效的11位手机号码');
            isValid = false;
        }

        // 验证用户名
        if (!username) {
            showError(usernameInput, '请输入用户名');
            isValid = false;
        } else if (username.length < 2 || username.length > 16) {
            showError(usernameInput, '用户名长度应为2-16个字符');
            isValid = false;
        } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(username)) {
            showError(usernameInput, '用户名只能包含中文、字母、数字和下划线');
            isValid = false;
        }

        // 验证密码
        if (!password) {
            showError(passwordInput, '请输入密码');
            isValid = false;
        } else if (password.length < 8 || password.length > 24) {
            showError(passwordInput, '密码长度应为8-24个字符');
            isValid = false;
        } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
            showError(passwordInput, '密码必须包含字母和数字');
            isValid = false;
        }

        // 验证确认密码
        if (!confirmPassword) {
            showError(confirmPasswordInput, '请确认密码');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordInput, '两次输入的密码不一致');
            isValid = false;
        }

        // 验证是否同意条款
        if (!agreeTerms) {
            showError(agreeTermsCheckbox, '请同意用户服务协议和隐私政策');
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

        // 对于复选框特殊处理
        if (inputElement.type === 'checkbox') {
            // 为复选框的父元素添加错误样式
            const parentLabel = inputElement.closest('.checkbox-label');
            if (parentLabel) {
                parentLabel.style.color = '#e74c3c';

                // 创建错误消息元素
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

                // 插入错误消息
                parentLabel.parentNode.appendChild(errorElement);

                // 点击复选框时移除错误样式
                const clearError = function() {
                    parentLabel.style.color = '#555';
                    if (errorElement.parentNode) {
                        errorElement.remove();
                    }
                    inputElement.removeEventListener('change', clearError);
                };

                inputElement.addEventListener('change', clearError);
            }
            return;
        }

        // 为其他输入框添加错误样式
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

        // 重置复选框标签样式
        const checkboxLabel = document.querySelector('.checkbox-label');
        if (checkboxLabel) {
            checkboxLabel.style.color = '#555';
        }
    }

    // 执行注册2025/12/23
    function performRegistration(phone, username, password) {
        // 显示加载状态
        const submitBtn = registerForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 注册中...';
        submitBtn.disabled = true;

        // 准备请求数据
        const requestData = {
            phone: phone,
            username: username,
            password: password,
            confirmPassword: document.getElementById('confirmPassword').value.trim(),
            agreeTerms: true
        };

        // 关键修改：使用正确的后端地址和请求头
        fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 添加必要的请求头
                'Accept': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                console.log('响应状态码:', response.status);
                console.log('响应头:', response.headers);

                // 先检查响应状态
                if (!response.ok) {
                    // 尝试获取错误信息
                    return response.text().then(text => {
                        console.error('错误响应内容:', text);
                        let errorMsg = `请求失败 (${response.status})`;
                        try {
                            const errorData = JSON.parse(text);
                            if (errorData.message) errorMsg = errorData.message;
                        } catch (e) {
                            // 如果不是JSON，使用原始文本
                            if (text) errorMsg = text;
                        }
                        throw new Error(errorMsg);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('注册成功，响应数据:', data);

                if (data.success) {
                    // 注册成功
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> 注册成功';
                    submitBtn.style.background = 'linear-gradient(to right, #27ae60, #219653)';

                    // 显示成功消息
                    showSuccessMessage(`注册成功！欢迎 ${username} 加入江西红色文化信息网。`);

                    // 2秒后跳转到登录页面
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    // 注册失败
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // 显示错误信息
                    let errorField = passwordInput;
                    let errorMsg = data.message || '注册失败';

                    // 根据错误信息选择显示位置
                    if (errorMsg.includes('手机') || errorMsg.includes('电话')) {
                        errorField = phoneInput;
                    } else if (errorMsg.includes('用户')) {
                        errorField = usernameInput;
                    } else if (errorMsg.includes('密码')) {
                        errorField = passwordInput;
                    }

                    showError(errorField, errorMsg);
                }
            })
            .catch(error => {
                console.error('注册请求错误:', error);

                // 恢复按钮状态
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // 更友好的错误提示
                let errorMessage = '注册失败：';
                if (error.message.includes('Failed to fetch') ||
                    error.message.includes('NetworkError')) {
                    errorMessage += '网络连接失败，请检查：\n';
                    errorMessage += '1. 后端服务是否已启动 (http://localhost:8080)\n';
                    errorMessage += '2. 查看浏览器控制台 Network 标签页\n';
                    errorMessage += '3. 检查后端控制台是否有错误日志';
                } else {
                    errorMessage += error.message;
                }

                // 显示错误
                alert(errorMessage); // 使用alert显示完整错误
                showError(passwordInput, '注册失败，请查看错误提示');
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
        const registerHeader = document.querySelector('.register-header');
        registerHeader.parentNode.insertBefore(successElement, registerHeader.nextSibling);

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

    // 显示模态框（用于显示用户协议和隐私政策）
    function showModal(title, content) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';

        // 模态框内容
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '8px';
        modalContent.style.padding = '30px';
        modalContent.style.maxWidth = '90%';
        modalContent.style.width = '500px';
        modalContent.style.maxHeight = '80%';
        modalContent.style.overflowY = 'auto';
        modalContent.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        modalContent.style.transform = 'translateY(-30px)';
        modalContent.style.transition = 'transform 0.3s ease';

        // 标题
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        modalTitle.style.color = '#a00000';
        modalTitle.style.marginBottom = '20px';
        modalTitle.style.fontSize = '22px';
        modalTitle.style.borderBottom = '2px solid #f0f0f0';
        modalTitle.style.paddingBottom = '10px';

        // 内容
        const modalBody = document.createElement('div');
        modalBody.innerHTML = content;
        modalBody.style.marginBottom = '30px';
        modalBody.style.lineHeight = '1.6';
        modalBody.style.color = '#555';

        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.backgroundColor = '#a00000';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '12px 24px';
        closeButton.style.borderRadius = '6px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        closeButton.style.fontWeight = '600';
        closeButton.style.width = '100%';
        closeButton.style.transition = 'all 0.3s';

        closeButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#8b0000';
        });

        closeButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#a00000';
        });

        // 组装模态框
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);

        // 添加到页面
        document.body.appendChild(modal);

        // 显示动画
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        }, 10);

        // 关闭模态框
        function closeModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(-30px)';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }

        // 点击关闭按钮关闭模态框
        closeButton.addEventListener('click', closeModal);

        // 点击模态框背景关闭模态框
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        // 按ESC键关闭模态框
        document.addEventListener('keydown', function escClose(event) {
            if (event.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escClose);
            }
        });
    }

    // 添加输入框焦点效果
    const formInputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="tel"]');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});