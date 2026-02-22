# Vercel 部署与 Commit 说明

## 为什么构建错误一直出现？

**原因：你本地修好的代码还没有提交并推送到 GitHub。**

- Vercel 每次构建的都是 **GitHub 仓库里当前分支的最新 commit**。
- 当前仓库里最新 commit 是 `70eb50e Initial commit`，里面还是旧的 `staticProjects.map(...)` 代码。
- 我们改的 `ImmigrationContent.tsx`（for 循环 + `ProjectItem[]`）只在你本机，状态是「已修改未提交」（`git status` 会显示 `M src/components/ImmigrationContent.tsx`）。
- 所以 Vercel 一直用旧代码构建，类型错误就会一直出现。

## 如何查看 commit？

### 本地查看

```bash
# 当前分支最近几条 commit
git log --oneline -5

# 当前未提交的修改
git status

# 本地和远程是否一致（无输出表示一致）
git rev-parse HEAD && git rev-parse origin/main
```

### Vercel 上查看每次部署用的是哪个 commit

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 打开你的项目（例如 easy-immigration / caimmigration）
3. 点 **Deployments**
4. 每个部署卡片上会写：
   - **Commit**: 例如 `194838c` 或 "fix: ImmigrationContent..."
   - **Branch**: 例如 `main`
   - 点进某次部署，在详情里也能看到对应的 commit SHA 和 message

**重要：** 若你已推送修复（commit 如 `194838c fix: ImmigrationContent projects state type for Vercel build`），请确认：
- 看的是 **最新一次** 部署（列表最上面、时间最近的那条），而不是之前失败的旧部署。
- 该部署的 **Commit** 必须是 `194838c`（或同一条 message）。若显示的还是 `70eb50e Initial commit`，说明这次部署不是由最新 push 触发的，需要检查 Vercel 的 **Production Branch** 是否设为 `main`，或手动点 **Redeploy** 让 Vercel 用最新代码再建一次。

## 正确流程：让 Vercel 用上修复

1. **提交本地修改**
   ```bash
   git add src/components/ImmigrationContent.tsx src/components/StudyContent.tsx src/components/VisaContent.tsx
   git commit -m "fix: ImmigrationContent projects state type for Vercel build"
   ```

2. **推送到 GitHub（Vercel 连的那个分支，一般是 main）**
   ```bash
   git push origin main
   ```

3. **等 Vercel 自动构建**
   - 推送后 Vercel 会自动用**新的 commit** 触发一次部署。
   - 在 Deployments 里会看到新的部署，Commit 会变成你刚 push 的那条。

4. **确认**
   - 新部署的 commit 信息里应包含你刚才的 commit message。
   - 若构建成功，类型错误就不会再出现。

## 小结

| 位置           | 看到的代码 / commit |
|----------------|---------------------|
| 你本机（未提交） | 已修复（for 循环）   |
| GitHub main    | 旧代码（Initial commit） |
| Vercel 构建    | 从 GitHub 拉取 = 旧代码 → 一直报错 |

**结论：** 把当前修改 **commit 再 push 到 main**，Vercel 就会用新 commit 构建，类型错误就会消失。

---

## Build Logs 一直显示 "Loading ..." 怎么办？

这是 Vercel 页面加载构建日志时的常见情况，可以按下面顺序试：

### 1. 看部署状态（不依赖 Build Logs）

- 在 **Deployments** 列表里看这条部署的**状态**：Building / Ready / Error。
- 若状态是 **Error**，说明构建已失败，只是日志没加载出来；若 **Ready** 说明已成功。

### 2. 刷新与重进

- **刷新页面**（F5 或 Cmd+R），再展开 Build Logs。
- 或关掉当前部署详情，从 **Deployments** 里重新点进这条部署，再展开 Build Logs。

### 3. 换浏览器 / 网络

- 用无痕/隐私模式，或换一个浏览器打开同一部署页面。
- 若用了 VPN/代理，可尝试关闭后再试（有时会影响 Vercel 接口）。

### 4. 用 Vercel CLI 看日志（不依赖网页）

在项目根目录安装并登录后，可直接拉取该次部署的日志：

```bash
npm i -g vercel
vercel login
vercel logs <部署的 URL> --output raw
```

或在 Dashboard 里该部署的 **「View Function Logs」/「Runtime Logs」** 看运行期日志（和构建日志不同，但能确认部署是否在跑）。

### 5. 重新部署一次

- 若只是某一次部署的 Build Logs 一直 Loading，可以**重新部署**让 Vercel 再生成一份新日志：
  - **方式 A**：再执行一次 `git push origin main`（会触发新部署）。
  - **方式 B**：在 Vercel 项目页 **Deployments** 里找到该部署，点 **「Redeploy」**。
- 新部署的 Build Logs 有时会正常加载。

### 6. 确认是否在构建中

- 若状态是 **Building**，Build Logs 可能会等构建跑一会儿才开始有输出，可等 1～2 分钟再刷新看。

总结：先看部署状态是 Error 还是 Ready，再刷新/重进/换浏览器；仍不行就用 CLI 看日志或 Redeploy 一次。

---

## 报错：No Output Directory named "public" found

**原因：** Vercel 把项目当成了非 Next.js（或 Framework 选成了 Other），于是用「Output Directory = public」去找构建结果；Next.js 实际输出在 `.next`，没有生成 `public` 目录，所以报错。

**解决：**

1. **项目里已加 `vercel.json`**（指定 `"framework": "nextjs"`），推送后 Vercel 会按 Next.js 处理，不再要求 `public`。
2. **在 Vercel 里再确认一次：**
   - 打开项目 → **Settings** → **Build & Development Settings**
   - **Framework Preset** 选 **Next.js**
   - **Output Directory**：若显示为 `public`，打开 **Override** 后**清空**该框并保存（交给 Next.js 默认）
   - 保存后重新部署一次
