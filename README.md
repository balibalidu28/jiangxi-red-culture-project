# 江西红色文化信息网站 — 项目目录（带详细注释）与四人分工

```plaintext
JX-RedCultureDisplay/                              # 项目根目录
├─ src/
│  ├─ main/
│  │  ├─ java/com/redculture/jxredculturedisplay/
│  │  │  ├─ controller/                           # 控制层（对外API与页面路由）
│  │  │  │  ├─ HeroController.java                # 红色英雄：列表、详情、增、改、删
│  │  │  │  ├─ EncyclopediaController.java        # 党史大百科：查询、模糊搜索、增改删
│  │  │  │  ├─ ScenicSpotController.java          # 红色圣地：列表/详情、增改删
│  │  │  │  ├─ StoryController.java               # 红色故事（文章）：CRUD（文章中心）
│  │  │  │  ├─ ExploreController.java             # 红色寻访（活动）：CRUD
│  │  │  │  ├─ UserController.java                # 用户注册/登录/基本信息
│  │  │  │  └─ AdminController.java               # 管理端统一维护接口（批量操作、审核等）
│  │  │  ├─ model/                                # 实体层（与数据库表一一对应）
│  │  │  │  ├─ RedHero.java                       # 表 red_hero（id, name, description, imageUrl）
│  │  │  │  ├─ PartyEncyclopedia.java             # 表 party_encyclopedia（id, title, content, imageUrl）
│  │  │  │  ├─ RedScenicSpot.java                 # 表 red_scenic_spot（id, name, description, location, imageUrl）
│  │  │  │  ├─ RedStory.java                      # 表 red_story（id, title, content, source）
│  │  │  │  ├─ RedExplore.java                    # 表 red_explore（id, title, content, date, location）
│  │  │  │  └─ User.java                          # 表 user（id, username, password, role）
│  │  │  ├─ repository/                           # 持久层（JPA仓库接口，负责DB访问）
│  │  │  │  ├─ RedHeroRepository.java
│  │  │  │  ├─ PartyEncyclopediaRepository.java
│  │  │  │  ├─ RedScenicSpotRepository.java
│  │  │  │  ├─ RedStoryRepository.java
│  │  │  │  ├─ RedExploreRepository.java
│  │  │  │  └─ UserRepository.java
│  │  │  ├─ service/                              # 业务层（编排业务逻辑，调用Repository）
│  │  │  │  ├─ RedHeroService.java
│  │  │  │  ├─ PartyEncyclopediaService.java
│  │  │  │  ├─ RedScenicSpotService.java
│  │  │  │  ├─ RedStoryService.java
│  │  │  │  ├─ RedExploreService.java
│  │  │  │  └─ UserService.java
│  │  │  └─ JxRedCultureDisplayApplication.java   # Spring Boot 启动主类
│  │  ├─ resources/
│  │  │  ├─ sql/
│  │  │  │  ├─ schema.sql                         # 建表脚本（推荐：5张业务表+user表）
│  │  │  │  └─ data.sql                           # 初始演示数据（可选，开发/演示用）
│  │  │  ├─ templates/                            # 页面模板（使用Thymeleaf时）
│  │  │  │  ├─ index.html                         # 首页（门户聚合，模块入口与精选卡片）【负责人：D】
│  │  │  │  ├─ hero/
│  │  │  │  │  ├─ list.html                       # 英雄列表页
│  │  │  │  │  └─ detail.html                     # 英雄详情页
│  │  │  │  ├─ encyclopedia/
│  │  │  │  │  ├─ list.html                       # 百科列表/搜索页
│  │  │  │  │  └─ detail.html                     # 百科词条详情
│  │  │  │  ├─ scenic/
│  │  │  │  │  ├─ list.html                       # 红色圣地列表（可含地图/筛选）
│  │  │  │  │  └─ detail.html                     # 圣地详情
│  │  │  │  ├─ story/
│  │  │  │  │  ├─ list.html                       # 红色故事文章列表
│  │  │  │  │  └─ edit.html                       # 故事文章编辑页（管理端使用）
│  │  │  │  ├─ explore/
│  │  │  │  │  ├─ list.html                       # 寻访活动列表/报名入口
│  │  │  │  │  └─ edit.html                       # 活动发布/编辑（管理端）
│  │  │  │  └─ admin/
│  │  │  │     ├─ dashboard.html                  # 管理后台首页（各模块入口与统计概览）
│  │  │  │     └─ login.html                      # 管理员登录页
│  │  │  ├─ static/                               # 静态资源（CSS/JS/图片）
│  │  │  │  ├─ css/
│  │  │  │  │  └─ main.css                        # 全站样式（首页含统一样式）【负责人：D】
│  │  │  │  ├─ js/
│  │  │  │  │  └─ main.js                         # 全站JS（导航/搜索/通用交互）【负责人：D】
│  │  │  │  └─ images/                            # 图片资源（logo、banner、示例图等）
│  │  │  └─ application.properties                # Spring & 数据库配置（见下：SQL初始化键）
│  ├─ test/java/com/redculture/jxredculturedisplay/
│  │  ├─ controller/…                             # 控制层接口测试（MockMvc）
│  │  ├─ service/…                                # 业务层单元测试
│  │  └─ repository/…                             # 仓库层（如需） 
├─ .gitignore                                     # 忽略target/、.idea/、*.iml等
├─ pom.xml                                        # Maven依赖
└─ README.md                                      # 项目说明、启动指南、分工、API文档
```

> 配置建议（Spring Boot 4.x）：
> - 仅初始化表结构：
    >   - spring.sql.init.schema-locations=classpath:sql/schema.sql
>   - spring.sql.init.mode=always
> - 如需演示数据，再加：
    >   - spring.sql.init.data-locations=classpath:sql/data.sql
```

---

## 四人明确分工（含首页负责人）

- A：红色英雄 + 红色故事（文章）
  - 代码范围：
    - controller/HeroController.java, StoryController.java
    - service/RedHeroService.java, RedStoryService.java
    - repository/RedHeroRepository.java, RedStoryRepository.java
    - model/RedHero.java, RedStory.java
    - templates/story/list.html, story/edit.html（与D协作样式）
  - 交付目标：英雄/故事完整CRUD；故事支持分页、按标题搜索。

- B：党史大百科 + 红色圣地
  - 代码范围：
    - controller/EncyclopediaController.java, ScenicSpotController.java
    - service/PartyEncyclopediaService.java, RedScenicSpotService.java
    - repository/PartyEncyclopediaRepository.java, RedScenicSpotRepository.java
    - model/PartyEncyclopedia.java, RedScenicSpot.java
    - templates/encyclopedia/list.html, detail.html；scenic/list.html, detail.html
  - 交付目标：百科支持关键词模糊检索；圣地支持地点筛选（后端参数）。

- C：红色寻访（活动）+ 用户
  - 代码范围：
    - controller/ExploreController.java, UserController.java
    - service/RedExploreService.java, UserService.java
    - repository/RedExploreRepository.java, UserRepository.java
    - model/RedExplore.java, User.java
    - templates/explore/list.html, edit.html；admin/login.html
  - 交付目标：寻访活动CRUD（含日期/地点）；用户注册/登录（可先明文，注明说明）。

- D：管理端 + 首页 + 集成与规范（首页负责人）
  - 代码范围：
    - controller/AdminController.java（整合各模块维护接口）
    - resources/sql/schema.sql, data.sql（保证与实体同步）
    - templates/index.html（首页门户，聚合各模块入口与精选内容）【首页负责人】
    - templates/admin/dashboard.html（管理后台主页）
    - static/css/main.css, static/js/main.js（全站风格/导航/搜索框/页头页脚）
    - README.md（启动、API文档、分工与规范）
  - 交付目标：
    - 首页信息聚合：最近故事、热门英雄、推荐圣地、百科入口、寻访预告；统一导航与页脚。
    - 提供全站UI一致性与公共组件（头部、底部、卡片样式）。

---

## 首页内容与数据来源（由D负责实现与协调）
- 顶部导航：英雄 | 百科 | 圣地 | 故事 | 寻访 | 管理后台
- 轮播/横幅：项目主题Banner
- 精选区块（各模块各取N条，调用对应Controller的列表接口）：
  - 英雄精选：/hero?limit=6
  - 故事精选：/story?limit=6&order=latest
  - 圣地推荐：/scenicspots?limit=6
  - 百科热搜入口：提供搜索框 -> GET /encyclopedias?kw=xxx
  - 寻访预告：/explore?upcoming=true&limit=3
- 页脚：项目介绍、开源许可（如需）、团队名单与分工

---

## 路由建议（可按需调整）
- 页面（Thymeleaf）：
  - GET / -> templates/index.html（首页，D）
  - GET /heroes -> hero/list.html（A）
  - GET /stories -> story/list.html（A）
  - GET /encyclopedias -> encyclopedia/list.html（B）
  - GET /scenicspots -> scenic/list.html（B）
  - GET /explore -> explore/list.html（C）
  - GET /admin -> admin/dashboard.html（D）
- API（JSON）：
  - /api/heroes, /api/stories, /api/encyclopedias, /api/scenicspots, /api/explore, /api/users, /api/admin/…

---

## 开发协作流程（简要）
- 每人独立分支开发 -> 提 PR 到 main
- D 负责首页与样式统一，合并前进行联调
- schema.sql 变更同步到 model 与 README
- data.sql 仅用于演示与联调（生产禁用）
