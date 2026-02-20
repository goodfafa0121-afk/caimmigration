-- 在 Supabase Dashboard → SQL Editor 中运行此脚本，创建本网站所需的表与存储桶。
-- Run this in Supabase Dashboard → SQL Editor.

-- ========== 1. 网站设置（Logo、合作院校 Logo 等） ==========
CREATE TABLE IF NOT EXISTS public.site_settings (
  key   text PRIMARY KEY,
  value text
);

-- 允许匿名用户读取（前台需要拉取 logo、合作院校 logo）
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_anon_read"
  ON public.site_settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "site_settings_service_all"
  ON public.site_settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ========== 2. 移民项目（后台维护，前台展示） ==========
CREATE TABLE IF NOT EXISTS public.immigration_projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text NOT NULL DEFAULT 'tech',
  hot         boolean NOT NULL DEFAULT false,
  title       text NOT NULL DEFAULT '',
  "desc"      text NOT NULL DEFAULT '',
  period      text NOT NULL DEFAULT '',
  investment  text NOT NULL DEFAULT '',
  identity    text NOT NULL DEFAULT '',
  language    text NOT NULL DEFAULT '',
  budget      text NOT NULL DEFAULT '',
  sort_order  int NOT NULL DEFAULT 0,
  image_url   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.immigration_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "immigration_projects_anon_read"
  ON public.immigration_projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "immigration_projects_service_all"
  ON public.immigration_projects FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ========== 3. 图片库（后台上传，复制链接用） ==========
CREATE TABLE IF NOT EXISTS public.media (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  url        text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- 仅 service_role 可读写（后台管理用）
CREATE POLICY "media_service_all"
  ON public.media FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ========== 4. 咨询表单提交（前台用户填写） ==========
CREATE TABLE IF NOT EXISTS public.consultations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  phone      text NOT NULL,
  email      text NOT NULL,
  message    text NOT NULL,
  locale     text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- 匿名用户仅可插入（提交表单）
CREATE POLICY "consultations_anon_insert"
  ON public.consultations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "consultations_service_all"
  ON public.consultations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ========== 5. 存储桶 site（Logo、媒体、合作院校 Logo、项目图） ==========
-- 公开桶，便于前台直接通过 URL 展示图片
INSERT INTO storage.buckets (id, name, public)
VALUES ('site', 'site', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 允许 service_role 上传/更新/删除（后台 API 使用）
CREATE POLICY "site_storage_service_all"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'site')
  WITH CHECK (bucket_id = 'site');
