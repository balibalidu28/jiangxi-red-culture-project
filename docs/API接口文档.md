# 江西红色文化展示平台 - API接口文档

**版本**: v1.0  
**更新时间**: 2024年  
**负责人**: D组

---

## 目录

1. [基础信息](#基础信息)
2. [认证相关API](#认证相关api)
3. [用户管理API](#用户管理api)
4. [英雄管理API](#英雄管理api)
5. [故事管理API](#故事管理api)
6. [圣地管理API](#圣地管理api)
7. [活动管理API](#活动管理api)
8. [百科管理API](#百科管理api)
9. [错误码说明](#错误码说明)

---

## 基础信息

### 服务器地址
- **开发环境**: `http://localhost:8080`
- **生产环境**: `待部署`

### 通用请求头
```
Content-Type: application/json
Accept: application/json
```

### 通用响应格式
```json
{
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

---

## 认证相关API

### 1. 用户注册

**接口**: `POST /api/auth/register`

**描述**: 新用户注册

**请求参数**:
```json
{
  "username": "testuser",
  "phone": "13800138000",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**字段说明**:
| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| username | String | 是 | 用户名,3-20字符,唯一 |
| phone | String | 是 | 手机号,11位数字,唯一 |
| password | String | 是 | 密码,6-20字符 |
| confirmPassword | String | 是 | 确认密码,需与password一致 |

**成功响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "userId": 1,
    "username": "testuser",
    "phone": "13800138000"
  }
}
```

**错误响应**:
```json
{
  "success": false,
  "message": "该用户名已被使用",
  "data": null
}
```

### 2. 用户登录

**接口**: `POST /api/auth/login`

**描述**: 用户登录验证

**请求参数**:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**字段说明**:
| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| username | String | 是 | 用户名或手机号 |
| password | String | 是 | 密码 |

**成功响应**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "userId": 1,
    "username": "testuser",
    "role": "USER",
    "token": "token_1_1234567890"
  }
}
```

### 3. 检查用户名可用性

**接口**: `GET /api/auth/check-username`

**描述**: 检查用户名是否已被使用

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| username | String | 是 | 待检查的用户名 |

**请求示例**: `GET /api/auth/check-username?username=testuser`

**成功响应**:
```json
{
  "success": true,
  "message": "用户名可用",
  "data": true
}
```

### 4. 检查手机号可用性

**接口**: `GET /api/auth/check-phone`

**描述**: 检查手机号是否已被注册

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| phone | String | 是 | 待检查的手机号 |

**请求示例**: `GET /api/auth/check-phone?phone=13800138000`

**成功响应**:
```json
{
  "success": true,
  "message": "手机号可用",
  "data": true
}
```

---

## 用户管理API

### 1. 获取所有用户

**接口**: `GET /api/admin/users`

**描述**: 获取系统中所有用户列表

**权限**: 管理员

**成功响应**:
```json
[
  {
    "id": 1,
    "username": "admin",
    "phone": "13800138000",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
]
```

### 2. 获取单个用户

**接口**: `GET /api/admin/users/{id}`

**描述**: 根据ID获取用户详细信息

**权限**: 管理员

**路径参数**:
| 参数 | 类型 | 说明 |
|-----|------|------|
| id | Integer | 用户ID |

**成功响应**:
```json
{
  "id": 1,
  "username": "admin",
  "phone": "13800138000",
  "role": "ADMIN",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

### 3. 创建用户

**接口**: `POST /api/admin/users`

**描述**: 创建新用户

**权限**: 管理员

**请求参数**:
```json
{
  "username": "newuser",
  "phone": "13900139000",
  "password": "password123",
  "role": "USER",
  "isActive": true
}
```

### 4. 更新用户

**接口**: `PUT /api/admin/users/{id}`

**描述**: 更新用户信息

**权限**: 管理员

**请求参数**:
```json
{
  "username": "updateduser",
  "phone": "13900139000",
  "password": "newpassword123",
  "role": "ADMIN",
  "isActive": false
}
```

**注意**: password字段为可选,如果提供则会更新密码

### 5. 删除用户

**接口**: `DELETE /api/admin/users/{id}`

**描述**: 删除指定用户

**权限**: 管理员

**路径参数**:
| 参数 | 类型 | 说明 |
|-----|------|------|
| id | Integer | 用户ID |

**成功响应**:
```json
{
  "success": true,
  "message": "用户删除成功"
}
```

---

## 英雄管理API

### 1. 获取所有英雄

**接口**: `GET /api/admin/heroes`

**描述**: 获取所有红色英雄列表

**权限**: 管理员

**成功响应**:
```json
[
  {
    "id": 1,
    "name": "毛泽东",
    "alias": "润之",
    "title": "中华人民共和国主席",
    "category": "领导人",
    "gender": "男",
    "ethnicity": "汉族",
    "birthDate": "1893-12-26",
    "deathDate": "1976-09-09",
    "birthplace": "湖南湘潭",
    "politicalStatus": "中国共产党党员",
    "description": "伟大的马克思主义者...",
    "content": "详细事迹内容...",
    "imageUrl": "/images/heroes/mao.jpg"
  }
]
```

### 2. 创建英雄

**接口**: `POST /api/admin/heroes`

**描述**: 创建新的红色英雄

**权限**: 管理员

**请求参数**:
```json
{
  "name": "周恩来",
  "alias": "翔宇",
  "title": "国务院总理",
  "category": "领导人",
  "gender": "男",
  "ethnicity": "汉族",
  "birthDate": "1898-03-05",
  "deathDate": "1976-01-08",
  "birthplace": "江苏淮安",
  "politicalStatus": "中国共产党党员",
  "description": "伟大的无产阶级革命家...",
  "content": "详细事迹内容...",
  "imageUrl": "/images/heroes/zhou.jpg"
}
```

### 3. 更新英雄

**接口**: `PUT /api/admin/heroes/{id}`

**描述**: 更新英雄信息

**权限**: 管理员

### 4. 删除英雄

**接口**: `DELETE /api/admin/heroes/{id}`

**描述**: 删除指定英雄

**权限**: 管理员

---

## 故事管理API

### 1. 获取所有故事

**接口**: `GET /api/admin/stories`

**描述**: 获取所有红色故事列表

**权限**: 管理员

**成功响应**:
```json
[
  {
    "id": 1,
    "title": "半条被子的故事",
    "content": "1934年11月,中央红军长征途经湖南汝城县...",
    "source": "新华社",
    "imageUrl": "/images/stories/half-quilt.jpg",
    "summary": "三名女红军与徐解秀老人的故事",
    "storyTime": "1934年11月",
    "location": "湖南汝城",
    "heroName": "邓颖超",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
]
```

### 2. 创建故事

**接口**: `POST /api/admin/stories`

**描述**: 创建新的红色故事

**权限**: 管理员

**请求参数**:
```json
{
  "title": "黄继光堵枪眼",
  "content": "1952年10月,在朝鲜上甘岭战役中...",
  "source": "人民日报",
  "imageUrl": "/images/stories/huang.jpg",
  "summary": "特级战斗英雄黄继光的英勇事迹",
  "storyTime": "1952年10月",
  "location": "朝鲜上甘岭",
  "heroName": "黄继光"
}
```

### 3. 更新故事

**接口**: `PUT /api/admin/stories/{id}`

**描述**: 更新故事信息

**权限**: 管理员

### 4. 删除故事

**接口**: `DELETE /api/admin/stories/{id}`

**描述**: 删除指定故事

**权限**: 管理员

---

## 圣地管理API

### 1. 获取所有圣地

**接口**: `GET /api/admin/scenicspots`

**描述**: 获取所有红色圣地列表

**权限**: 管理员

**成功响应**:
```json
[
  {
    "id": 1,
    "name": "井冈山革命根据地",
    "description": "中国革命的摇篮,第一个农村革命根据地",
    "location": "江西省吉安市",
    "imageUrl": "/images/scenic/jinggangshan.jpg"
  }
]
```

### 2. 创建圣地

**接口**: `POST /api/admin/scenicspots`

**描述**: 创建新的红色圣地

**权限**: 管理员

**请求参数**:
```json
{
  "name": "延安革命纪念馆",
  "description": "展示延安革命历史的重要场所",
  "location": "陕西省延安市",
  "imageUrl": "/images/scenic/yanan.jpg"
}
```

### 3. 更新圣地

**接口**: `PUT /api/admin/scenicspots/{id}`

**描述**: 更新圣地信息

**权限**: 管理员

### 4. 删除圣地

**接口**: `DELETE /api/admin/scenicspots/{id}`

**描述**: 删除指定圣地

**权限**: 管理员

---

## 活动管理API

### 1. 获取所有活动

**接口**: `GET /api/admin/explore`

**描述**: 获取所有红色寻访活动列表

**权限**: 管理员

**成功响应**:
```json
[
  {
    "id": 1,
    "title": "重走长征路主题活动",
    "image": "/images/explore/changzheng.jpg",
    "city": "江西",
    "startTime": "2024-05-01T09:00:00",
    "endTime": "2024-05-03T17:00:00",
    "location": "井冈山革命根据地",
    "maxParticipants": 100,
    "status": "UPCOMING",
    "organization": "江西省文化厅",
    "registrationEmail": "activity@example.com",
    "registrationForm": "/files/explore/form.docx",
    "description": "重温革命历史,传承红色基因",
    "schedule": [
      {
        "title": "第一天",
        "startTime": "09:00",
        "endTime": "17:00",
        "content": "参观井冈山革命博物馆"
      }
    ],
    "registrationDeadline": "2024-04-25"
  }
]
```

### 2. 创建活动

**接口**: `POST /api/admin/explore`

**描述**: 创建新的寻访活动

**权限**: 管理员

**请求参数**:
```json
{
  "title": "瑞金红色教育之旅",
  "image": "/images/explore/ruijin.jpg",
  "city": "江西",
  "startTime": "2024-06-01T09:00:00",
  "endTime": "2024-06-02T17:00:00",
  "location": "瑞金市",
  "maxParticipants": 50,
  "status": "UPCOMING",
  "organization": "江西省教育厅",
  "registrationEmail": "edu@example.com",
  "registrationForm": null,
  "description": "探访共和国摇篮",
  "schedule": [],
  "registrationDeadline": "2024-05-25"
}
```

### 3. 更新活动

**接口**: `PUT /api/admin/explore/{id}`

**描述**: 更新活动信息

**权限**: 管理员

### 4. 删除活动

**接口**: `DELETE /api/admin/explore/{id}`

**描述**: 删除指定活动

**权限**: 管理员

### 5. 上传活动图片

**接口**: `POST /api/admin/explore/{id}/upload-image`

**描述**: 上传活动封面图片

**权限**: 管理员

**请求方式**: `multipart/form-data`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| file | File | 是 | 图片文件,支持jpg/png格式 |

**成功响应**:
```json
{
  "success": true,
  "url": "/images/explore/abc123.jpg"
}
```

### 6. 上传报名表

**接口**: `POST /api/admin/explore/{id}/upload-registration-form`

**描述**: 上传活动报名表文件

**权限**: 管理员

**请求方式**: `multipart/form-data`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| file | File | 是 | 文件,支持pdf/doc/docx/xls/xlsx格式 |

**成功响应**:
```json
{
  "success": true,
  "url": "/files/explore/form123.docx"
}
```

---

## 百科管理API

### 1. 获取所有百科

**接口**: `GET /api/admin/encyclopedia`

**描述**: 获取所有党史大百科条目列表

**权限**: 管理员

**成功响应**:
```json
[
  {
    "id": 1,
    "title": "五四运动",
    "content": "1919年5月4日,北京学生举行游行示威...",
    "imageUrl": "/images/encyclopedia/may4th.jpg"
  }
]
```

### 2. 创建百科

**接口**: `POST /api/admin/encyclopedia`

**描述**: 创建新的百科条目

**权限**: 管理员

**请求参数**:
```json
{
  "title": "开国大典",
  "content": "1949年10月1日,中华人民共和国中央人民政府成立...",
  "imageUrl": "/images/encyclopedia/founding.jpg"
}
```

### 3. 更新百科

**接口**: `PUT /api/admin/encyclopedia/{id}`

**描述**: 更新百科条目信息

**权限**: 管理员

### 4. 删除百科

**接口**: `DELETE /api/admin/encyclopedia/{id}`

**描述**: 删除指定百科条目

**权限**: 管理员

---

## 错误码说明

### HTTP状态码

| 状态码 | 说明 |
|-------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 业务错误码

| 错误码 | 说明 |
|-------|------|
| 1001 | 用户名已存在 |
| 1002 | 手机号已注册 |
| 1003 | 密码不一致 |
| 1004 | 用户名或密码错误 |
| 1005 | 账户已被禁用 |
| 1006 | 用户不存在 |
| 2001 | 英雄姓名重复 |
| 3001 | 故事标题重复 |
| 4001 | 圣地名称重复 |
| 5001 | 活动时间冲突 |
| 5002 | 报名人数已满 |
| 6001 | 百科标题重复 |
| 9999 | 系统错误 |

---

## 测试建议

### 使用Postman测试

1. 导入API集合
2. 设置环境变量:
   - `baseUrl`: `http://localhost:8080`
3. 测试顺序:
   - 用户注册 → 用户登录 → 获取token
   - 使用token访问管理端接口

### 使用curl测试

```bash
# 用户注册
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "phone": "13800138000",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# 用户登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# 获取所有用户
curl -X GET http://localhost:8080/api/admin/users
```

---

**文档维护**: D组  
**最后更新**: 2024年  
**版本**: v1.0
