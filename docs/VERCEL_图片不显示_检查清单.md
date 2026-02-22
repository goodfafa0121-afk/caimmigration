# Vercel 部署后图片不显示 — 检查清单

按顺序做，做完一步就测一次网站。

---

## ① 在 Vercel 添加这 4 个环境变量

打开：**Vercel 项目 → Settings → Environment Variables**

添加（名称必须一模一样，值从本地 `.env.local` 里复制）：

| 变量名 | 示例值（你的 .env.local 里已有） |
|--------|----------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nxgspllsvssepelxheoc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 以 `eyJ...` 开头的一长串 |
| `SUPABASE_SERVICE_ROLE_KEY` | 以 `eyJ...` 开头的一长串 |
| `ADMIN_PASSWORD` | `CA2026`（或你设的密码） |

- **Environments** 勾选：**Production**（以及 Preview 如需要）
- 点 **Save**

注意：**不要** 把 `NEXT_PUBLIC_SUPABASE_URL` 填成 `postgresql://...`，必须是 `https://nxgspllsvssepelxheoc.supabase.co`。

---

## ② 保存后必须重新部署

- 打开 **Deployments**
- 最新一条部署右侧点 **⋯** → **Redeploy**
- 可选：勾选 **Clear build cache** 再点 **Redeploy**
- 等状态变成 **Ready**

---

## ③ 用诊断接口看是否连通

在浏览器打开（把 `你的域名` 换成你的 Vercel 域名）：

```
https://你的域名.vercel.app/api/site/supabase-check
```

例如：`https://caimmigration-11.vercel.app/api/site/supabase-check`

看返回的 JSON：

- **`ok: true`** → 说明 Vercel 已连上 Supabase 并读到数据，图片应能显示；若仍不显示，看 ④
- **`env.urlSet: false`** → 说明环境变量没生效，检查 ① 和 ②（变量名是否完全一致、是否 Redeploy）
- **`data.bannersCount: 0` 且 `logoOk: false`** → 说明 Supabase 里没有数据，需要先在本地后台上传，见 ④

---

## ④ 确认 Supabase 里真的有图

- 登录 [Supabase](https://supabase.com/dashboard) → 选项目 **nxgspllsvssepelxheoc**
- **Table Editor** → 表 **site_settings**
  - 是否有 `key = home_banners` 的一行？点开看 **value** 是否是 JSON，里面有没有 `image_url`（且是 `https://...` 开头的完整地址）
  - 是否有 `key = logo_url`、`key = consult_qr_image`，且 value 是完整 https 地址？
- **Storage** → 看是否有 **site** 桶（或你存图的桶）→ 该桶是否设为 **Public**

若表里没有这些 key 或 value 是空的，需要：
1. 本地运行 `npm run dev`，打开 http://localhost:3000/admin
2. 用后台上传「首页 Banner」「网站 Logo」「在线咨询二维码」
3. 保存后，再在 Vercel 上 **Redeploy** 一次

---

## ⑤ 仍不显示时

- 强制刷新：**Ctrl+F5**（Windows）或 **Cmd+Shift+R**（Mac）
- 或无痕窗口打开网站再试

若按上面都做了仍不显示，把 **`/api/site/supabase-check` 页面里整段 JSON 复制发给我**，我可以根据结果 pinpoint 问题。
