import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import StudyVisaSection from "@/components/StudyVisaSection";
import VisaServicesSection from "@/components/VisaServicesSection";
import WhyUs from "@/components/WhyUs";
import SuccessWall from "@/components/SuccessWall";
import Cases from "@/components/Cases";
import ScoresSection from "@/components/ScoresSection";
import TeamSection from "@/components/TeamSection";
import StatsBar from "@/components/StatsBar";
import Footer from "@/components/Footer";
import ConsultQRCard from "@/components/ConsultQRCard";
import { getHomeBanners } from "@/lib/banners";
import {
  getHomeRecommendedProjectImages,
  getHomeStudyServicesImages,
  getHomeVisaServicesImages,
  getHomeSuccessWallImages,
  getHomeTeamAvatars,
} from "@/lib/home-services-images";
import { getConsultQrImageUrl } from "@/lib/consult-qr-image";

export default async function Home() {
  let initialBanners: Awaited<ReturnType<typeof getHomeBanners>> = [];
  let initialServiceImages: Awaited<ReturnType<typeof getHomeRecommendedProjectImages>> = { slotImages: Array(8).fill(""), projectImages: Array(8).fill("") };
  let initialStudyImages: string[] = Array(6).fill("");
  let initialVisaImages: string[] = Array(4).fill("");
  let initialSuccessWallImages: string[] = Array(10).fill("");
  let initialTeamAvatars: string[] = Array(3).fill("");
  let initialConsultQrUrl: string | null = null;
  try {
    const [banners, serviceImages, studyImages, visaImages, successWallImages, teamAvatars, consultQrUrl] = await Promise.all([
      getHomeBanners(),
      getHomeRecommendedProjectImages(),
      getHomeStudyServicesImages(),
      getHomeVisaServicesImages(),
      getHomeSuccessWallImages(),
      getHomeTeamAvatars(),
      getConsultQrImageUrl(),
    ]);
    initialBanners = banners;
    initialServiceImages = serviceImages;
    initialStudyImages = studyImages;
    initialVisaImages = visaImages;
    initialSuccessWallImages = successWallImages;
    initialTeamAvatars = teamAvatars;
    initialConsultQrUrl = consultQrUrl;
  } catch (_e) {
    // 数据源异常时使用默认空数据，避免整页 500
  }
  return (
    <>
      <ConsultQRCard initialConsultQrUrl={initialConsultQrUrl} />
      <main>
        <Hero initialBanners={initialBanners} />
        <About />
        <Services initialSlotImages={initialServiceImages.slotImages} initialProjectImages={initialServiceImages.projectImages} />
        <StudyVisaSection initialImages={initialStudyImages} />
        <VisaServicesSection initialImages={initialVisaImages} />
        <WhyUs />
        <SuccessWall initialImages={initialSuccessWallImages} />
        <Cases />
        <ScoresSection />
        <TeamSection initialAvatars={initialTeamAvatars} />
        <StatsBar />
        <Footer />
      </main>
    </>
  );
}
