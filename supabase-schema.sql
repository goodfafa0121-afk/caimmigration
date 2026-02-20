-- 在 Supabase SQL Editor 中执行此脚本，创建咨询表单存储表

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  message text,
  locale text,
  created_at timestamptz default now()
);

-- 启用 RLS（按需可再细化策略）
alter table public.consultations enable row level security;

-- 允许匿名用户插入（仅用于官网表单提交）
create policy "Allow anonymous insert"
  on public.consultations
  for insert
  to anon
  with check (true);

-- 仅认证用户可查询（便于后台查看）
create policy "Allow authenticated read"
  on public.consultations
  for select
  to authenticated
  using (true);
