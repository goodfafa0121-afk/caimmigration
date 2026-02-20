# 后台管理配置说明

后台提供：**Logo 上传**、**图片上传**、**移民项目增删**。

## 1. 环境变量

在项目根目录 `.env.local` 中配置：

```env
# 已有
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon key

# 后台登录密码（必填，否则无法登录后台）
ADMIN_PASSWORD=你的管理密码

# 后端写入 Supabase 用（必填，否则无法上传 Logo/图片、无法增删移民项目）
SUPABASE_SERVICE_ROLE_KEY=你的 service_role key
```

- `ADMIN_PASSWORD`：登录 `/admin` 时使用的密码。
- `SUPABASE_SERVICE_ROLE_KEY`：在 Supabase 控制台 → Project Settings → API 中复制 **service_role**（勿泄露、仅用于服务端）。

## 2. Supabase 数据库

在 Supabase 控制台 → SQL Editor 中执行：

- 执行 `supabase/migrations/20250214000000_admin_tables.sql` 中的 SQL，创建表：
  - `site_settings`（存 logo_url 等）
  - `media`（图片记录）
  - `immigration_projects`（移民项目）

## 3. Supabase Storage

在 Supabase 控制台 → Storage 中：

1. 新建 bucket，名称设为 **`site`**。
2. 将 bucket 设为 **Public**（公开读）。
3. Policies：若仅通过本站 API 上传（使用 service_role），可不给 anon 写权限；若希望前端直传，再为 anon 配置 upload policy。

## 4. 使用方式

- 访问 **`/admin`**，输入 `ADMIN_PASSWORD` 登录。
- 登录后进入 **`/admin/dashboard`**：
  - **网站 Logo**：选择图片后点击「上传 Logo」，前台 Header 会显示该 Logo（未上传时显示站点名称文案）。
  - **图片库**：上传图片后可复制链接，用于页面其他位置。
  - **移民项目**：添加/删除项目；前台 `/immigration` 会优先显示后台配置的列表，无数据时使用文案中的默认列表。

## 5. 安全说明

- 生产环境务必使用强密码 `ADMIN_PASSWORD`，并启用 HTTPS。
- `SUPABASE_SERVICE_ROLE_KEY` 仅放在服务端环境变量中，不要提交到代码仓库或暴露给前端。
