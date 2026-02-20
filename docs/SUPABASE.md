# 连接 Supabase 数据库

本站已集成 Supabase，用于后台的网站 Logo、图片库、合作院校 Logo、移民项目等数据与文件存储。按下列步骤即可接通。

## 1. 创建 Supabase 项目

1. 打开 [Supabase](https://supabase.com) 并登录。
2. 点击 **New project**，选择组织、填写项目名与数据库密码，选区域后创建。
3. 等待项目就绪后，进入 **Project Settings** → **API**，记下：
   - **Project URL**（如 `https://xxxx.supabase.co`）
   - **anon public** key（匿名公钥）
   - **service_role** key（服务端密钥，勿泄露到前端）

## 2. 执行数据库脚本

1. 在 Supabase 左侧打开 **SQL Editor**。
2. 新建查询，将项目根目录下 `supabase/schema.sql` 的内容全部粘贴进去。
3. 点击 **Run** 执行。  
   脚本会创建表：`site_settings`、`immigration_projects`、`media`、`consultations`，以及公开存储桶 `site` 和相应 RLS 策略。

## 3. 配置环境变量

在项目根目录复制示例环境文件并填入真实值：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填写：

```env
# 后台管理密码（登录 /admin 使用）
ADMIN_PASSWORD=你的后台密码

# Supabase（必填才能连上数据库）
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=你的-service-role-key
```

- `NEXT_PUBLIC_*` 会暴露到浏览器，仅放 URL 和 anon key。
- `SUPABASE_SERVICE_ROLE_KEY` 仅用于服务端（API Routes），不要写进前端代码。

## 4. 重启本地/部署

- 本地：保存 `.env.local` 后重启 `npm run dev`。
- 部署（Vercel 等）：在项目设置里添加上述三个 Supabase 变量和 `ADMIN_PASSWORD`，重新部署。

## 5. 验证

- 打开 **/admin**，用 `ADMIN_PASSWORD` 登录。
- 在后台上传 **网站 Logo** 或 **图片库** 图片，若成功且前台能显示，说明 Supabase 已连通。
- 若未配置 Supabase 或未填环境变量，后台会退回到本地文件（如 `public/uploads`）或返回空数据。

## 数据与存储说明

| 用途           | 表/存储           | 说明 |
|----------------|-------------------|------|
| 网站 Logo      | `site_settings` + 存储桶 `site` | key = `logo_url` |
| 合作院校 Logo  | `site_settings` + 存储桶 `site` | key = `partner_school_logos`，JSON 数组 |
| 移民项目       | `immigration_projects` + 存储桶 `site` | 后台增删改，前台只读 |
| 图片库         | `media` + 存储桶 `site` | 后台上传、复制链接 |
| 咨询表单       | `consultations`        | 前台用户提交，仅插入 |

存储桶 `site` 已设为 **公开**，前台通过返回的 URL 即可直接访问图片。
