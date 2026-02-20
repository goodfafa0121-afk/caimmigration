-- 移民项目卡片图片：后台可上传，前台展示
ALTER TABLE immigration_projects ADD COLUMN IF NOT EXISTS image_url TEXT;
