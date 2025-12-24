// 根据当前页面来源动态确定后端基地址
const BASE_URL = (location.port === '8080' || location.origin.includes('localhost:8080'))
    ? location.origin
    : 'http://localhost:8080';

const API = {
    auth: {
        register: `${BASE_URL}/api/auth/register`,
        login: `${BASE_URL}/api/auth/login`,
        checkUsername: `${BASE_URL}/api/auth/check-username`,
        checkPhone: `${BASE_URL}/api/auth/check-phone`,
    },
    admin: {
        users: `${BASE_URL}/api/admin/users`,
    },
};

// 统一请求封装
async function request(url, options = {}) {
    const resp = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const ct = resp.headers.get('content-type') || '';
    const isJson = ct.includes('application/json');

    if (!resp.ok) {
        let message = `HTTP ${resp.status}`;
        try {
            message = isJson ? (await resp.json()).message || message : await resp.text();
        } catch (e) {
            // ignore parse error
        }
        throw new Error(message);
    }
    return isJson ? await resp.json() : await resp.text();
}

// 简单提示
function toast(msg, type = 'info') {
    console.log(`[${type}] ${msg}`);
}

// 表单显示/隐藏
function showUserForm(editing = false) {
    document.getElementById('userFormContainer').style.display = 'block';
    document.getElementById('userFormTitle').textContent = editing ? '编辑用户' : '新增用户';
}

function hideUserForm() {
    document.getElementById('userFormContainer').style.display = 'none';
    clearForm();
}

function clearForm() {
    document.getElementById('userId').value = '';
    document.getElementById('username').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('role').value = 'USER';
    document.getElementById('isActive').value = 'true';
}

// 加载用户列表
async function loadUsers() {
    console.log('开始加载用户列表...');
    console.log('请求URL:', API.admin.users);
    try {
        const users = await request(API.admin.users, { method: 'GET' });
        renderUsersTable(users);
        console.log('用户列表加载完成，共', users.length, '条记录');
    } catch (e) {
        toast(`加载用户失败：${e.message}`, 'error');
    }
}

function renderUsersTable(users = []) {
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';
    users.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${u.id ?? ''}</td>
      <td>${u.username ?? ''}</td>
      <td>${u.phone ?? ''}</td>
      <td>${u.role ?? ''}</td>
      <td>${u.isActive ? '启用' : '禁用'}</td>
      <td>${u.createdAt ?? ''}</td>
      <td>${u.updatedAt ?? ''}</td>
      <td>
        <button onclick="startEditUser(${u.id})">编辑</button>
        <button onclick="deleteUser(${u.id})">删除</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

// 拉取单个用户
async function startEditUser(id) {
    try {
        const u = await request(`${API.admin.users}/${id}`, { method: 'GET' });
        document.getElementById('userId').value = u.id;
        document.getElementById('username').value = u.username ?? '';
        document.getElementById('phone').value = u.phone ?? '';
        document.getElementById('role').value = u.role ?? 'USER';
        document.getElementById('isActive').value = String(Boolean(u.isActive));
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';
        showUserForm(true);
    } catch (e) {
        toast(`获取用户详情失败：${e.message}`, 'error');
    }
}

// 保存：新增或更新
async function saveUser() {
    const id = document.getElementById('userId').value.trim();
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    const isActive = document.getElementById('isActive').value === 'true';

    if (!username || !phone) {
        toast('用户名和手机号为必填', 'warn');
        return;
    }

    if (!id) {
        // 新增：先校验，再走注册接口
        if (!password || !confirmPassword) {
            toast('新增用户需填写密码与确认密码', 'warn');
            return;
        }
        if (password !== confirmPassword) {
            toast('两次输入的密码不一致', 'warn');
            return;
        }
        try {
            const usernameOk = await checkUsernameAvailable(username);
            if (!usernameOk) return toast('用户名已被使用', 'warn');

            const phoneOk = await checkPhoneAvailable(phone);
            if (!phoneOk) return toast('手机号已被注册', 'warn');

            const res = await request(API.auth.register, {
                method: 'POST',
                body: JSON.stringify({ username, phone, password, confirmPassword }),
            });
            toast(res.message || '注册成功', 'success');

            const newUserId = res.data?.userId;
            if (newUserId && (role !== 'USER' || isActive !== true)) {
                await request(`${API.admin.users}/${newUserId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ role, isActive }),
                });
            }
            hideUserForm();
            await loadUsers();
        } catch (e) {
            toast(`新增失败：${e.message}`, 'error');
        }
    } else {
        // 更新
        try {
            const payload = { username, phone, role, isActive };
            if (password || confirmPassword) {
                if (password !== confirmPassword) {
                    return toast('修改密码需同时填写且一致', 'warn');
                }
                payload.password = password;
            }
            await request(`${API.admin.users}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            });
            toast('更新成功', 'success');
            hideUserForm();
            await loadUsers();
        } catch (e) {
            toast(`更新失败：${e.message}`, 'error');
        }
    }
}

// 删除
async function deleteUser(id) {
    if (!confirm(`确认删除用户 ${id} 吗？`)) return;
    try {
        await request(`${API.admin.users}/${id}`, { method: 'DELETE' });
        toast('删除成功', 'success');
        await loadUsers();
    } catch (e) {
        toast(`删除失败：${e.message}`, 'error');
    }
}

// 可用性检查
async function checkUsernameAvailable(username) {
    try {
        const res = await request(`${API.auth.checkUsername}?username=${encodeURIComponent(username)}`, { method: 'GET' });
        // 你的 ApiResponse.data = true 表示可用
        return Boolean(res.data);
    } catch (e) {
        toast(`检查用户名失败：${e.message}`, 'warn');
        return true; // 不阻塞
    }
}
async function checkPhoneAvailable(phone) {
    try {
        const res = await request(`${API.auth.checkPhone}?phone=${encodeURIComponent(phone)}`, { method: 'GET' });
        return Boolean(res.data);
    } catch (e) {
        toast(`检查手机号失败：${e.message}`, 'warn');
        return true;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', loadUsers);