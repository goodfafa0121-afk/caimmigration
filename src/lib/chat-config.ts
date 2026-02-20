/**
 * 在线聊天浮窗配置（右下角弹出）
 * 修改此处即可更新顾问信息、电话、微信等
 */
export const chatConfig = {
  /** 顾问称呼（如 Billy） */
  agentName: "顾问",
  /** 顾问职位（如 首席移民留学规划师） */
  agentTitle: "移民留学规划师",
  /** 顾问头像 URL，留空则使用默认占位图 */
  agentAvatar: "" as string,
  /** 咨询电话（点击可拨打） */
  phone: "400-xxx-xxxx",
  /** 微信账号（用于展示或复制） */
  wechat: "bbll001_",
  /** 是否在打开网站时自动展开聊天框（false = 仅显示气泡，点击后展开） */
  autoOpen: false,
} as const;
