# 在线聊天浮窗说明

本站已集成**右下角在线咨询浮窗**，用户打开任意页面即可看到绿色「在线咨询」气泡，点击后展开聊天框。

## 已实现功能

- 右下角固定气泡按钮，点击展开/收起
- 聊天框：顾问信息（头像、职位、姓名）、欢迎语与简介、消息列表
- 支持输入并发送消息；发送后自动回复「已收到，将尽快联系」
- 顶部提供**致电**（`tel:` 链接）与**微信**展示
- 支持最小化（保留小条，再次点击可展开）、关闭
- 中英文随站点语言切换

## 如何修改顾问信息与电话

编辑 **`src/lib/chat-config.ts`**：

- `agentName`：顾问称呼（如 Billy）
- `agentTitle`：职位（如 首席移民留学规划师）
- `agentAvatar`：头像图片 URL，留空则显示首字
- `phone`：咨询电话（点击可拨打）
- `wechat`：微信号（用于展示）
- `autoOpen`：设为 `true` 则打开网站时自动展开聊天框（默认 `false`）

## 可选：接入第三方客服

若希望使用**在线客服系统**（真人或机器人接待、多端同步、历史记录等），可选用：

1. **Tawk.to**（免费）：嵌入脚本，多端对话、可手机 App 回复  
   - 官网：https://www.tawk.to/  
   - 在 Next 的 `layout.tsx` 或 `_document` 中引入其提供的 script 即可

2. **Crisp**（免费档）：聊天 + 邮件 + 知识库  
   - 官网：https://crisp.chat/

3. **其他**：Intercom、LiveChat、Tidio、美洽、智齿等，均为「嵌入一段 JS」即可在站内出现聊天框。

接入第三方后，若不再需要自带的浮窗，可在 `src/app/layout.tsx` 中移除 `<ChatWidget />`。

## 可选：把留言存到数据库

当前发送的消息仅在前端展示并自动回复，**未写入后端**。若已配置 Supabase，可：

1. 在 Supabase 中新建表（如 `chat_messages`），字段：`id`、`role`、`content`、`created_at` 等  
2. 在 `ChatWidget` 的 `handleSend` 中调用 `supabase.from('chat_messages').insert(...)` 保存用户消息  
3. 如需真人回复，可再做一个后台或用 Supabase 的 Realtime 推送新消息到前端

这样即可在后台查看留言并选择用电话/微信回复。
