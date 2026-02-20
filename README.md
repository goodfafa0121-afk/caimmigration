# 简单移民咨询官网 | Easy Immigration Consulting Inc.

专业加拿大移民咨询公司官网，基于 Next.js 15 + TypeScript + TailwindCSS + Supabase 构建。

## 技术栈

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Supabase**（咨询表单数据存储）

## 功能

- 中英文双语切换
- 响应式布局（手机/电脑）
- 首页模块：导航、Hero、关于我们、服务项目（Express Entry / CEC / PNP / 学签转移民）、为什么选择我们、成功案例、在线咨询表单、页脚
- 咨询表单对接 Supabase
- 基础 SEO（标题、描述、关键词：加拿大移民、Express Entry、PNP 等）
- 组件化、企业风排版

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量：复制 .env.local.example 为 .env.local，填入 Supabase 的 URL 与 anon key
cp .env.local.example .env.local

# 启动开发服务器
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

## Supabase 配置

网站使用 Supabase 存储：网站 Logo、图片库、合作院校 Logo、移民项目及咨询表单等。完整步骤见 **[docs/SUPABASE.md](docs/SUPABASE.md)**。

简要步骤：
1. 在 [Supabase](https://supabase.com) 创建项目。
2. 在 SQL Editor 中执行 **supabase/schema.sql**，创建表与存储桶。
3. 在 Project Settings → API 中复制 **Project URL**、**anon public** key 和 **service_role** key，填入 `.env.local`（参考 `.env.local.example`）。

## 构建与部署

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── app/              # App Router 页面与布局
├── components/       # 页面组件（Header, Hero, About, Services, WhyUs, Cases, ContactForm, Footer）
├── contexts/         # 语言切换 Context
└── lib/              # i18n 文案、Supabase 客户端
```

## 品牌主色

- 主色：`#C8102E`（Tailwind 中使用 `brand`）
