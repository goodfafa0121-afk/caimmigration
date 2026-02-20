-- 后台管理用表（需在 Supabase Dashboard 执行）
-- 1. 网站设置（如 logo URL）
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 2. 媒体库（上传的图片记录）
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 移民项目（可后台增删，与前台 immigration 列表同步）
CREATE TABLE IF NOT EXISTS immigration_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  hot BOOLEAN DEFAULT false,
  title TEXT NOT NULL,
  "desc" TEXT NOT NULL,
  period TEXT NOT NULL,
  investment TEXT NOT NULL,
  identity TEXT NOT NULL,
  language TEXT NOT NULL,
  budget TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 允许匿名读取（前台拉取）
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE immigration_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "media_read" ON media FOR SELECT USING (true);
CREATE POLICY "immigration_projects_read" ON immigration_projects FOR SELECT USING (true);

-- 写入由后端 API 使用 service_role key 执行，此处不开放 anon 写权限

-- Storage: 在 Supabase Dashboard 创建 bucket 名为 "site"，设为 Public，Policy 允许 public read 和 anon upload（或使用 service_role 在 API 上传）
