# Vercel 部署后图片/内容不显示说明

## 常见原因一览

| 原因 | 表现 | 处理方式 |
|------|------|----------|
| Vercel 未配 Supabase 环境变量 | 接口返回空，Banner/Logo/二维码等都不显示 | 在 Vercel 添加 4 个 env，并 Redeploy |
| Next.js 未允许 Supabase 图片域名 | Logo 等用 `<Image>` 的图被拦截、不显示 | 已在 `next.config.js` 增加 `**.supabase.co` 的 remotePatterns |
| Supabase 里存的是相对路径 | 本地 `/uploads/xxx` 有效，Vercel 上 404 | 后台上传时确保用 Supabase 存储，存的是完整 https URL |
| Supabase Storage 桶未设为公开 | 图片 URL 正确但请求 403/404 | 在 Supabase Dashboard → Storage → 对应 bucket → 设为 Public |

---

## 原因（详细）

本地能看到的这些内容，**全部来自 Supabase 或依赖 Supabase**：

| 内容 | 数据来源 | Vercel 未配 Supabase 时 |
|------|----------|--------------------------|
| 首页轮播 Banner（背景图+文案） | Supabase `site_settings` → `home_banners`，图片存 Supabase Storage | 不显示，用默认静态文案 |
| 网站 Logo | Supabase `site_settings` → `logo_url`（或本地 `public/uploads`，但 Vercel 没有该目录） | 不显示 |
| 24 小时在线咨询二维码 | Supabase `site_settings` → `consult_qr_image` | 不显示 |
| 留学/签证页头部背景图 | Supabase 或本地 `public/uploads`（Vercel 无本地上传） | 不显示 |
| 首页推荐项目/留学/签证/成功墙/团队头像等图片 | Supabase `site_settings` 或 `immigration_projects` 等表 | 不显示 |

也就是说：**Vercel 上没有配置 Supabase 环境变量时，这些接口拿不到数据，图片和部分内容就不会出现。**

---

## 正确做法（让线上和本地一致）

### 1. 在 Vercel 配置环境变量

在项目 **Settings → Environment Variables** 里添加（与 `.env.local` 一致）：

- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

保存后，在 **Deployments** 里对当前生产部署点 **Redeploy**（建议勾选 **Clear build cache**），让新变量生效。

### 2. 数据要在 Supabase 里已有

- 你在**本地**后台（`/admin`）上传的 Banner、Logo、咨询二维码等，如果当时已配置 Supabase，会保存在 **Supabase 的 site_settings + Storage** 里。
- Vercel 部署后只是「从 Supabase 读同一份数据」，所以只要 Vercel 配好了上述 4 个变量，**不需要在 Vercel 再传一遍图**，刷新线上站就会看到和本地一样的内容。

若你从未在本地后台上传过（或上传时还没配 Supabase），Supabase 里就是空的，那需要：

1. 本地先确保 `.env.local` 里 Supabase 已配好；
2. 在本地打开 `/admin`，上传首页 Banner、Logo、咨询二维码等；
3. 保存后，再在 Vercel 上 **Redeploy** 一次，线上就会显示这些图片和内容。

### 3. 不要依赖「本地独有」的文件

- `public/uploads/` 下的文件（如本地手动放的图）**不会**随 Git 推到 Vercel，所以**不要**指望这些路径在线上存在。
- 所有希望线上也显示的图片，都应通过**后台上传**保存到 **Supabase Storage**（或 Supabase 里存的完整 URL），这样 Vercel 才能通过接口拿到并显示。

---

## 小结

- **部署到 Vercel 后图片/内容不全**：多半是 **Vercel 未配 Supabase 环境变量** 或 **配了但没 Redeploy**。
- 配好 4 个变量并 Redeploy 后，若 Supabase 里已有你在本地上传的数据，线上就会和本地一致；若 Supabase 里还没有，需要先在本地后台上传一次，再 Redeploy。
