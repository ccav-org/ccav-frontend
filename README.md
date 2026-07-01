# ccav-frontend

**CCAV 平台前端 App Router 迁移版本 (Next.js 16)**

> ⚠️ **NOT PRODUCTION-READY** — 此仓库是来自 legacy ccav-web 前端的迁移候选。
> 当前生产环境仍由旧系统提供服务。请勿直接部署此仓库到生产环境。

---

## 状态

| 项目 | 状态 |
|------|------|
| 原始基线 | ✅ `47611842` — security: remove hardcoded provider secrets |
| S1 (preservation tag) | ✅ `pre-sanitization-47611842` |
| S2 (build artifacts cleanup) | ✅ 删除 tar.gz 构建产物 + 19 个 .bak 文件 |
| S3 (ops artifacts relocation) | ✅ deploy 脚本 + nginx 配置已移入 `docs/legacy-deploy-evidence/` |
| S4/S5 (docs + package name) | ✅ SSOT 边界文档 + 包重命名 |
| 构建测试 | ✅ `npm run build` 通过 |
| Lint | ⚠️ 现有 51 errors / 3031 warnings（eslint 预存问题，非本次引入） |

---

## 仓库边界 (SSOT)

### 包含 ✅
- `src/app/` — App Router 页面路由（迁移自 ccav-web）
- `src/components/` — UI 组件（Navbar, CcavLogo, AuthModal, LessonCard 等）
- `src/lib/` — 工具库（api, auth, klingApi, courseData 等）
- `server/` — **Express 后端**（同机运行，`ccav-server`）。保留作为历史运行时兼容，未来将拆分为独立后端
- `public/` — 静态资源

### 不属于前端 SSOT（已移入 docs/）
- `docs/legacy-deploy-evidence/` — deploy 脚本与 nginx 配置。仅供历史参考，请勿在仓库中直接运行

### 临时保留
- `src/lib/courseData.ts` — 3,119 行硬编码课程数据，临时保留为迁移数据资产，后续应改为 API 获取

### 生产边界
- ❌ **请勿将本仓库直接部署到生产环境**
- ❌ 旧系统仍为生产前端，此仓库为迁移过渡
- ❌ 无部署脚本、nginx 配置在根目录

---

## 开发

```bash
npm install
npm run dev     # Next.js 开发服务器 (port 3000)
npm run build   # 构建 + archive-build 后处理
npm start       # 生产模式预览
```

**注意：** `server/` 目录需单独启动：
```bash
cd server && npm install && npm run dev
```

---

## Provider 环境变量治理

### Required (必须设置)
- `JWT_SECRET` — 签名密钥。缺失时 server 拒绝启动，error 信息见 console

### Optional (推荐设置)
- `KIMI_API_KEY` — Kimi/Moonshot API Key。缺失时仅启动 warning，`/api/optimize` 及 `/api/kimi/chat` 不可用
- `KLING_ACCESS_KEY` + `KLING_SECRET_KEY` — 可灵 AI API 密钥。缺失时仅启动 warning，`/api/kling/*` 不可用
- `REPLICATE_API_KEY` — Replicate API Key。当前未正式启用，缺失仅 warning

### 安全说明
- ❌ 所有密钥通过 `.env` 文件注入或 `export` 设置，不得硬编码在源码中
- ❌ `.env` 已通过 `.gitignore` 排除，不会提交到仓库
- ❌ 勿将 `.env.example` 中的占位值直接用于生产
- ❌ 勿在前端代码 (`src/lib/klingApi.ts`) 直接暴露 provider 密钥到浏览器端

### Browser Direct Kling（开发/原型适用）
- `src/lib/klingApi.ts` 提供浏览器端直接调用可灵 API 的客户端库，密钥存储于 `localStorage`
- **⚠️ 仅限开发/原型验证**——生产环境应通过后端 `/api/kling/*` 代理调用，不可在前端暴露 API 密钥

## 待办 (未来阶段)

- [ ] server/ 后端拆分为独立仓库
- [ ] courseData.ts 改为 API 获取
- [ ] S6: 添加 .gitignore safety rules (tar.gz, .bak, *.db 等)
- [ ] 清理 lint 预存问题
- [ ] API 数据迁移与生产切换
