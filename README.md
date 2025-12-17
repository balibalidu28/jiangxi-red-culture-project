# jiangxi-red-culture-project
一个江西红色文化展示的课程设计项目，团队开发。
JX-RedCultureDisplay/
├── src/
│   ├── main/
│   │   ├── java/com/redculture/jxredculturedisplay/  # Java后端代码
│   │   │   ├── controller/                          # 控制层
│   │   │   │   ├── ScenicSpotController.java         # 景点信息展示接口
│   │   │   │   ├── CommentController.java            # 评论功能接口
│   │   │   │   ├── AdminController.java              # 管理员控制接口
│   │   │   │   └── UserController.java               # 用户注册与登录接口
│   │   │   ├── model/                                # 数据表模型
│   │   │   │   ├── ScenicSpot.java                   # 景点数据模型
│   │   │   │   ├── Comment.java                      # 评论数据模型
│   │   │   │   ├── User.java                         # 用户数据模型
│   │   │   ├── repository/                           # 数据访问层
│   │   │   │   ├── ScenicSpotRepository.java         # 景点信息数据访问
│   │   │   │   ├── CommentRepository.java            # 评论数据访问
│   │   │   │   └── UserRepository.java               # 用户数据访问
│   │   │   ├── service/                              # 服务层（业务逻辑）
│   │   │   │   ├── ScenicSpotService.java            # 景点信息服务
│   │   │   │   ├── CommentService.java               # 评论服务
│   │   │   │   └── UserService.java                  # 用户服务
│   │   │   └── JXRedCultureDisplayApplication.java    # 主入口类（启动Spring Boot）
│   │   ├── resources/                                # 项目资源文件
│   │   │   ├── sql/                                  # SQL脚本
│   │   │   │   ├── schema.sql                        # 数据库结构文件
│   │   │   │   ├── data.sql                          # 初始化数据文件
│   │   │   ├── application.properties                # Spring Boot配置文件
│   │   │   └── static/                               # 前端静态资源文件
│   │   │       ├── css/                              # 样式文件
│   │   │       │   ├── main.css                      # 首页样式
│   │   │       │   ├── admin.css                     # 后台样式
│   │   │       ├── js/                               # JavaScript文件
│   │   │       │   ├── app.js                        # 前端逻辑：景点展示、评论功能
│   │   │       │   ├── admin.js                      # 后台管理逻辑
│   │   │       ├── images/                           # 静态图片资源
│   │   │           ├── jinggangshan.jpg              # 景点：井冈山
│   │   │           ├── ruijin.jpg                    # 景点：瑞金
│   │   │           └── sample.jpg                    # 样例图片
│   │   └── templates/                                # 前端HTML模板
│   │       ├── index.html                            # 首页展示（景点列表）
│   │       ├── scenic-details.html                   # 景点详情页面（评论功能）
│   │       ├── admin.html                            # 管理员后台页面
│   │       └── login.html                            # 用户登录页面
│   ├── test/                                         # 测试代码
│   │   └── java/com/redculture/jxredculturedisplay/  # 单元测试类
├── database/                                         # 数据库相关文档
│   ├── schema.sql                                    # 数据库表结构备份
│   ├── data.sql                                      # 数据初始化数据备份
│   └── diagrams/                                     # 数据库设计图
│       ├── er-diagram.png                            # 数据库ER图
│       ├── flowchart.png                             # 数据处理流程图
├── docs/                                             # 项目文档
│   ├── report/                                       # 报告文件夹
│   │   ├── UserA_Report.docx                         # 组员A报告
│   │   ├── UserB_Report.docx                         # 组员B报告
│   │   ├── UserC_Report.docx                         # 组员C报告
│   │   └── UserD_Report.docx                         # 组员D报告
│   ├── diagrams/                                     # 系统设计图
│   │   ├── system-overview.png                       # 系统结构设计图
│   │   ├── module-design.png                         # 模块设计图
│   └── videos/                                       # 撰录演示视频
│       ├── UserA_Demo.mp4                            # 组员A演示视频
│       ├── UserB_Demo.mp4                            # 组员B演示视频
│       ├── UserC_Demo.mp4                            # 组员C演示视频
│       └── UserD_Demo.mp4                            # 组员D演示视频
├── .gitignore                                        # Git忽略文件配置
├── pom.xml                                           # Maven依赖管理文件
├── README.md                                         # 项目说明文档                     
有任何建议和bug相关问题写在下面：（规范化）
文件名：问题——提交人——日期