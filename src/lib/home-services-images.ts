import { supabaseAdmin } from "@/lib/supabase/server";

const SLOT_COUNT = 8;

/** 服务端获取首页「推荐移民项目」8 张卡片的图片 URL，用于首屏直出、避免刷新后图片延迟显示 */
export async function getHomeRecommendedProjectImages(): Promise<{ slotImages: string[]; projectImages: string[] }> {
  const client = supabaseAdmin;
  if (!client) {
    return { slotImages: Array(SLOT_COUNT).fill(""), projectImages: Array(SLOT_COUNT).fill("") };
  }

  const [slotResult, projectsResult] = await Promise.all([
    client.from("site_settings").select("value").eq("key", "home_services_images").maybeSingle(),
    client.from("immigration_projects").select("image_url").order("sort_order", { ascending: true }).limit(SLOT_COUNT),
  ]);

  let slotImages = Array(SLOT_COUNT).fill("");
  if (slotResult.data?.value) {
    try {
      const arr = JSON.parse(slotResult.data.value) as string[];
      slotImages = Array.from({ length: SLOT_COUNT }, (_, i) =>
        Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""
      );
    } catch {
      // keep default empty
    }
  }

  const projectImages = Array.from({ length: SLOT_COUNT }, (_, i) => {
    const row = projectsResult.data?.[i];
    return row && typeof (row as { image_url?: string }).image_url === "string" ? (row as { image_url: string }).image_url : "";
  });

  return { slotImages, projectImages };
}

/** 服务端获取首页「推荐留学服务」6 张卡片的图片 URL */
export async function getHomeStudyServicesImages(): Promise<string[]> {
  const client = supabaseAdmin;
  if (!client) return Array(6).fill("");
  const { data } = await client.from("site_settings").select("value").eq("key", "home_study_services_images").maybeSingle();
  if (!data?.value) return Array(6).fill("");
  try {
    const arr = JSON.parse(data.value) as string[];
    return Array.from({ length: 6 }, (_, i) => (Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""));
  } catch {
    return Array(6).fill("");
  }
}

const VISA_SERVICE_SLOT_COUNT = 6;

/** 服务端获取「推荐签证服务」图片 URL：首页用前 4 张，签证页用全部 6 张（含超级签证、毕业工签） */
export async function getHomeVisaServicesImages(): Promise<string[]> {
  const client = supabaseAdmin;
  if (!client) return Array(VISA_SERVICE_SLOT_COUNT).fill("");
  const { data } = await client.from("site_settings").select("value").eq("key", "home_visa_services_images").maybeSingle();
  if (!data?.value) return Array(VISA_SERVICE_SLOT_COUNT).fill("");
  try {
    const arr = JSON.parse(data.value) as string[];
    return Array.from({ length: VISA_SERVICE_SLOT_COUNT }, (_, i) => (Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""));
  } catch {
    return Array(VISA_SERVICE_SLOT_COUNT).fill("");
  }
}

/** 服务端获取首页「服务团队」3 位顾问头像 URL */
export async function getHomeTeamAvatars(): Promise<string[]> {
  const client = supabaseAdmin;
  if (!client) return Array(3).fill("");
  const { data } = await client.from("site_settings").select("value").eq("key", "team_avatar_urls").maybeSingle();
  if (!data?.value) return Array(3).fill("");
  try {
    const arr = JSON.parse(data.value) as string[];
    return Array.from({ length: 3 }, (_, i) => (Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""));
  } catch {
    return Array(3).fill("");
  }
}

/** 服务端获取首页「成功获批展示」10 格的图片 URL */
export async function getHomeSuccessWallImages(): Promise<string[]> {
  const client = supabaseAdmin;
  if (!client) return Array(10).fill("");
  const { data } = await client.from("site_settings").select("value").eq("key", "home_success_wall_images").maybeSingle();
  if (!data?.value) return Array(10).fill("");
  try {
    const arr = JSON.parse(data.value) as string[];
    return Array.from({ length: 10 }, (_, i) => (Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""));
  } catch {
    return Array(10).fill("");
  }
}
