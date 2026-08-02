面向 **NayePankh Foundation** 的全栈 Web 应用，用于数字化管理 NGO 活动、志愿者参与、捐赠记录、公益宣传活动以及日常行政事务。平台将志愿者、捐赠者与管理员集中连接，简化 NGO 日常运营。

项目目标是用直观的数字化平台替代传统手工流程，提升透明度、可访问性与运营效率。

<br>
<p align="center">
  <img src ="public/bg-slide1.jpg"  alt="手持向日葵的孩子" width="500">
</p>

---

## 🛠 技术栈
- 前端：React + Vite + Tailwind CSS（Nginx 部署）
- 后端 / 认证 / 数据库：Firebase（Auth + Firestore，可选）
- AI：Google Gemini API（可选）
- 支付：Razorpay（可选）

## 🚀 启动指南
1. 确保 Docker Desktop 已启动。
2. 在根目录执行：`docker compose up --build`
3. 等待容器启动完成...

## 🔗 服务地址
- 前端：http://localhost:3071

> 说明：本项目为前端应用。未配置 Firebase 环境变量时，自动使用 **localStorage 本地模拟模式**（登录、志愿申请、捐赠记录等均可本地演示）。如需接入真实 Firebase / Gemini / Razorpay，可在构建时通过 `docker compose` build args 传入对应的 `VITE_*` 变量。

## 🧪 测试账号
- 管理员：`admin@nayepankh.org` / `123456`（邮箱含 `admin` 即赋予管理员角色；本地模拟模式下任意密码均可登录）
- 普通用户：`user@example.com` / `123456`（也可自行注册）

## ✅ 验证步骤
1. 打开前端（http://localhost:3071），确认首页与导航正常加载。
2. 进入登录页，使用 `admin@nayepankh.org / 123456` 登录，确认可进入管理后台（`/admin`）。
3. 浏览关于我们 / 活动 / 捐赠 / 参与志愿 等页面，确认路由与内容可访问。
4. 退出后使用普通邮箱注册或登录，确认普通用户无法进入 `/admin`。

---

## 🐳 Docker 镜像源配置

### 推荐配置（基于实际项目验证）

#### 1. Docker 镜像源
**使用 DaoCloud 代理的官方镜像**（国内拉取更稳）

```yaml
# docker-compose.yml 示例
services:
  frontend:
    build: .
    ports:
      - "3071:80"
```

#### 2. npm 依赖源
**使用淘宝镜像**（国内访问快）

在 `Dockerfile` 中添加：
```dockerfile
RUN npm config set registry https://registry.npmmirror.com
```

#### 3. 前端构建加速规范（npm ci）

为了极致的构建速度和依赖一致性，**必须**遵循以下流程：

1.  **本地预处理**：在提交代码前，**必须**在本地运行一次 `npm install`，确保 `package-lock.json` 文件存在且是最新的。
2.  **锁文件提交**：**绝对严禁**在 `.gitignore` 中忽略锁文件。必须将锁文件提交至仓库，这是容器内高效构建的前提。
3.  **容器内安装**：在 `Dockerfile` 中，必须使用 `npm ci` 代替 `npm install`。
    -   **优势**：`npm ci` 比 `npm install` 快 2-3 倍，且会根据锁文件进行 100% 确定性的安装，避免“本地能跑，容器报错”的灵异问题。
    -   **注意**：`npm ci` 要求工作目录必须存在 `package-lock.json`，否则会报错。

---

### 常用镜像推荐

| 技术栈 | 推荐镜像 | 说明 |
| :--- | :--- | :--- |
| Node.js | `node:20-alpine` | 前端构建 |
| Nginx | `nginx:alpine` | 前端生产环境 |

### 配置示例

#### Node.js 项目 Dockerfile
```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 使用建议

1. ✅ **优先使用官方镜像**（本仓库经 DaoCloud 代理拉取）：稳定可靠
2. ✅ **使用 Alpine 版本**：镜像体积小，构建速度快
3. ✅ **配置 npm 淘宝源**：加速国内依赖下载
4. ✅ **多阶段构建**：减小最终镜像体积

### 常见问题

**Q: Docker 镜像拉取失败？**  
A: 检查网络连接，确保 Docker Desktop 正常运行

**Q: npm install 很慢？**  
A: 确保已配置淘宝镜像源：`npm config set registry https://registry.npmmirror.com`

**Q: 是否需要配置 Docker Hub 镜像加速器？**  
A: 通常不需要，仓库已使用 `docker.m.daocloud.io` 代理。如遇到问题再考虑额外配置

**Q: Docker 端口冲突问题？**  
A: 本项目前端端口为 `3071`（按 GSB0731 错开）。如冲突可修改 `docker-compose.yml` 中的端口映射

---

# 📌 目录

- 项目概述
- 问题背景
- 项目目标
- 功能特性
- 技术栈详解
- 系统架构
- 项目结构
- 管理端功能
- 用户端功能
- 未来规划
- 部署方式
- 开源许可

---

# 📖 项目概述

许多非政府组织仍通过电子表格、纸质记录或多个互不连通的平台管理志愿者、捐赠、活动与宣传项目，容易造成数据不一致、沟通滞后与管理低效。

**NayePankh - NGO 管理系统** 提供统一平台，可实现：

- 志愿者注册并参与活动
- 捐赠者捐款并持续了解进展
- 管理员高效管理日常运营
- 访客浏览宣传活动与公益事件

应用强调简洁、可访问与可扩展。

---

# ❓ 问题背景

许多 NGO 面临如下挑战：

- 志愿者注册依赖人工
- 捐赠追踪困难
- 志愿者与管理员沟通不畅
- 线上曝光不足
- 缺少集中化的活动管理
- 档案维护效率低

本项目通过现代化的 Web 管理平台解决上述问题。

---

# 🎯 项目目标

- 数字化 NGO 运营流程
- 简化志愿者管理
- 提升捐赠者参与度
- 增强透明度
- 提供介绍 NGO 活动的信息平台
- 降低行政负担
- 构建可访问、响应式的 Web 应用

---

# ✨ 功能特性

## 🌐 公开网站

- 响应式首页
- 关于 NayePankh
- 使命与愿景
- 进行中的宣传活动
- 活动专区
- 在办项目
- 影响力故事
- 图库
- 参与方式（实习、志愿、成为合作伙伴、与我们共事）
- 联系页面
- 常见问题

---

## 💻 AI 功能（仅管理员可用）

- AI 社交媒体文案生成
- 志愿者 / 实习生 AI 证书生成
- 捐赠倡议文案生成
- 活动报告生成
- 致谢帖文生成

---

## 👥 志愿者模块

- 志愿者注册
- 安全登录
- 个人资料管理
- 查看活动
- 参与宣传项目
- 追踪志愿活动记录

---

## 💝 捐赠模块

- 捐赠表单
- 捐赠记录
- 宣传活动信息
- 支持 NGO 倡议

---

## 🔐 身份认证

- 安全登录
- 用户认证
- 管理员认证
- 受保护路由

---

## 👨‍💼 管理后台

管理后台可对平台进行全面控制。

### 管理员可以：

- 管理志愿者
- 查看已注册用户
- 使用 AI 功能
- 管理捐赠
- 创建宣传活动
- 更新 NGO 信息
- 查看联系请求
- 管理活动
- 监控平台动态

---

## 📱 响应式设计

应用已针对以下设备优化：

- 桌面端
- 平板端

---

# 🛠 技术栈详解

## 前端

- React.js
- JavaScript (ES6)
- HTML5
- CSS3 / Tailwind CSS
- Vite

---

## 后端 / 数据

- Firebase Authentication
- Cloud Firestore
- localStorage 本地模拟（未配置 Firebase 时）

---

## 其他能力

- Google Gemini（AI 文案与证书等）
- Razorpay（捐赠支付，可选）

---

## 版本控制

- Git
- GitHub

---

## 部署方式

- Docker Desktop（推荐一键启动）
- Nginx（容器内静态托管）
- Vercel（可选）

---

# 🏗 系统架构

```
                用户
                  │
                  ▼
          React 前端
                  │
     Firebase SDK / 本地模拟
                  │
                  ▼
     Firebase Auth + Firestore
        （或 localStorage）
```

---

# 📂 项目结构

```
NayePankh-NGO
│
├── public
├── src
│   ├── assets
│   ├── components
│   ├── context
│   ├── firebase
│   ├── hooks
│   ├── layouts
│   ├── pages
│   ├── services
│   ├── App.jsx
│   └── main.jsx
│
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
└── README.md
```

---

# 💡 未来规划

- 邮件通知
- 志愿者考勤追踪
- 数据分析看板
- 志愿者排行榜
- 基于角色的访问控制增强
- 多语言支持
- 推送通知
- 移动应用

---

# 🔒 安全特性

- Firebase / 本地身份认证
- 密码加密（Firebase Auth）
- 受保护的页面路由
- 基于角色的授权
- 安全的数据读写策略（Firestore）

---

# 🌍 项目价值

该平台帮助 NGO：

- 数字化管理志愿者
- 提升捐赠者参与度
- 高效组织宣传活动
- 增强运营透明度
- 减少纸质流程
- 改善沟通协作
- 打造更强的线上存在感

---

# 📄 开源许可

本项目用于教育、作品集展示与演示目的。

---

## ⭐ 如果觉得这个项目有帮助，欢迎在 GitHub 上点个 Star！
