"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ADMIN_TOKEN = "admin_token";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const pwd = sessionStorage.getItem(ADMIN_TOKEN);
  return pwd ? { "x-admin-password": pwd } : {};
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState<{ id: string; name: string; url: string }[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [projects, setProjects] = useState<{ id: string; type: string; title: string; desc: string; image_url?: string | null }[]>([]);
  const [projectImageFile, setProjectImageFile] = useState<Record<string, File>>({});
  const [projectImageLoading, setProjectImageLoading] = useState<Record<string, boolean>>({});
  const [partnerLogos, setPartnerLogos] = useState<string[]>(() => Array(6).fill(""));
  const [partnerLogoFile, setPartnerLogoFile] = useState<Record<number, File>>({});
  const [partnerLogoLoading, setPartnerLogoLoading] = useState<Record<number, boolean>>({});
  const [projectForm, setProjectForm] = useState({
    type: "tech",
    hot: false,
    title: "",
    desc: "",
    period: "",
    investment: "",
    identity: "",
    language: "",
    budget: "",
  });
  const [projectFormImage, setProjectFormImage] = useState<File | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [banners, setBanners] = useState<{ image_url: string; title: string; subtitle: string; cta_text: string; cta_link?: string }[]>([]);
  const [bannerForm, setBannerForm] = useState({ title: "", subtitle: "", cta_text: "免费评估", cta_link: "" });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [serviceImages, setServiceImages] = useState<string[]>(() => Array(8).fill(""));
  const [serviceImageFile, setServiceImageFile] = useState<Record<number, File>>({});
  const [serviceImageLoading, setServiceImageLoading] = useState<Record<number, boolean>>({});
  const [studyServiceImages, setStudyServiceImages] = useState<string[]>(() => Array(6).fill(""));
  const [studyServiceImageFile, setStudyServiceImageFile] = useState<Record<number, File>>({});
  const [studyServiceImageLoading, setStudyServiceImageLoading] = useState<Record<number, boolean>>({});
  const [visaServiceImages, setVisaServiceImages] = useState<string[]>(() => Array(6).fill(""));
  const [visaServiceImageFile, setVisaServiceImageFile] = useState<Record<number, File>>({});
  const [visaServiceImageLoading, setVisaServiceImageLoading] = useState<Record<number, boolean>>({});
  const [successWallImages, setSuccessWallImages] = useState<string[]>(() => Array(10).fill(""));
  const [successWallImageFile, setSuccessWallImageFile] = useState<Record<number, File>>({});
  const [successWallImageLoading, setSuccessWallImageLoading] = useState<Record<number, boolean>>({});
  const [teamAvatars, setTeamAvatars] = useState<string[]>(() => Array(3).fill(""));
  const [teamAvatarFile, setTeamAvatarFile] = useState<Record<number, File>>({});
  const [teamAvatarLoading, setTeamAvatarLoading] = useState<Record<number, boolean>>({});
  const [studyHeroImageUrl, setStudyHeroImageUrl] = useState<string | null>(null);
  const [studyHeroFile, setStudyHeroFile] = useState<File | null>(null);
  const [studyHeroLoading, setStudyHeroLoading] = useState(false);
  const [visaHeroImageUrl, setVisaHeroImageUrl] = useState<string | null>(null);
  const [visaHeroFile, setVisaHeroFile] = useState<File | null>(null);
  const [visaHeroLoading, setVisaHeroLoading] = useState(false);
  const [enterpriseConditionsImageUrl, setEnterpriseConditionsImageUrl] = useState<string | null>(null);
  const [enterpriseTaxServiceImageUrl, setEnterpriseTaxServiceImageUrl] = useState<string | null>(null);
  const [enterpriseConditionsFile, setEnterpriseConditionsFile] = useState<File | null>(null);
  const [enterpriseTaxServiceFile, setEnterpriseTaxServiceFile] = useState<File | null>(null);
  const [enterpriseConditionsLoading, setEnterpriseConditionsLoading] = useState(false);
  const [enterpriseTaxServiceLoading, setEnterpriseTaxServiceLoading] = useState(false);
  const [footerQrUrls, setFooterQrUrls] = useState<string[]>(() => Array(2).fill(""));
  const [footerQrFile, setFooterQrFile] = useState<Record<number, File>>({});
  const [footerQrLoading, setFooterQrLoading] = useState<Record<number, boolean>>({});
  const [consultQrImageUrl, setConsultQrImageUrl] = useState<string | null>(null);
  const [consultQrFile, setConsultQrFile] = useState<File | null>(null);
  const [consultQrLoading, setConsultQrLoading] = useState(false);
  const [immigrationProjectImages, setImmigrationProjectImages] = useState<string[]>(() => Array(12).fill(""));
  const [immigrationProjectImageFile, setImmigrationProjectImageFile] = useState<Record<number, File>>({});
  const [immigrationProjectImageLoading, setImmigrationProjectImageLoading] = useState<Record<number, boolean>>({});
  const [seo, setSeo] = useState({
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });
  const [seoLoading, setSeoLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json().catch(() => ({}));
      setLogoUrl(data?.logoUrl ?? null);
    } catch {
      setLogoUrl(null);
    }
  }, []);

  const loadMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setMediaItems(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setMediaItems([]);
    }
  }, [router]);

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/projects", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setProjects(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setProjects([]);
    }
  }, [router]);

  const loadPartnerLogos = useCallback(async () => {
    try {
      const res = await fetch("/api/site/partner-schools");
      const data = await res.json().catch(() => ({}));
      const logos = Array.isArray(data?.logos) ? data.logos : [];
      setPartnerLogos(Array.from({ length: 6 }, (_, i) => logos[i] ?? ""));
    } catch {
      setPartnerLogos(Array(6).fill(""));
    }
  }, []);

  const loadServiceImages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/recommended-project-images", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setServiceImages(Array.isArray(data?.images) ? data.images.slice(0, 8) : Array(8).fill(""));
    } catch {
      setServiceImages(Array(8).fill(""));
    }
  }, [router]);

  const loadImmigrationProjectImages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/immigration-project-images", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setImmigrationProjectImages(Array.isArray(data?.images) ? data.images.slice(0, 12) : Array(12).fill(""));
    } catch {
      setImmigrationProjectImages(Array(12).fill(""));
    }
  }, [router]);

  const loadSeo = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setSeo({
        title: data?.title ?? "",
        description: data?.description ?? "",
        keywords: data?.keywords ?? "",
        ogTitle: data?.ogTitle ?? "",
        ogDescription: data?.ogDescription ?? "",
        ogImage: data?.ogImage ?? "",
      });
    } catch {
      setSeo({ title: "", description: "", keywords: "", ogTitle: "", ogDescription: "", ogImage: "" });
    }
  }, [router]);

  const loadStudyServiceImages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/study-services-images", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setStudyServiceImages(Array.isArray(data?.images) ? data.images.slice(0, 6) : Array(6).fill(""));
    } catch {
      setStudyServiceImages(Array(6).fill(""));
    }
  }, [router]);

  const loadVisaServiceImages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/visa-services-images", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setVisaServiceImages(Array.isArray(data?.images) ? data.images.slice(0, 6) : Array(6).fill(""));
    } catch {
      setVisaServiceImages(Array(6).fill(""));
    }
  }, [router]);

  const loadSuccessWallImages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/success-wall-images", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setSuccessWallImages(Array.isArray(data?.images) ? data.images.slice(0, 10) : Array(10).fill(""));
    } catch {
      setSuccessWallImages(Array(10).fill(""));
    }
  }, [router]);

  const loadStudyHeroImage = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/study-hero-image", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setStudyHeroImageUrl(data?.imageUrl ?? null);
    } catch {
      setStudyHeroImageUrl(null);
    }
  }, [router]);

  const loadVisaHeroImage = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/visa-hero-image", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setVisaHeroImageUrl(data?.imageUrl ?? null);
    } catch {
      setVisaHeroImageUrl(null);
    }
  }, [router]);

  const loadEnterpriseModuleImages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/enterprise-module-images", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setEnterpriseConditionsImageUrl(data?.conditionsImageUrl ?? null);
      setEnterpriseTaxServiceImageUrl(data?.taxServiceImageUrl ?? null);
    } catch {
      setEnterpriseConditionsImageUrl(null);
      setEnterpriseTaxServiceImageUrl(null);
    }
  }, [router]);

  const loadFooterQr = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/footer-qr", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setFooterQrUrls(Array.isArray(data?.qrUrls) ? data.qrUrls.slice(0, 2) : Array(2).fill(""));
    } catch {
      setFooterQrUrls(Array(2).fill(""));
    }
  }, [router]);

  const loadConsultQr = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/consult-qr", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setConsultQrImageUrl(data?.imageUrl && String(data.imageUrl).trim() ? data.imageUrl : null);
    } catch {
      setConsultQrImageUrl(null);
    }
  }, [router]);

  const loadTeamAvatars = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/team-avatars", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setTeamAvatars(Array.isArray(data?.avatars) ? data.avatars.slice(0, 3) : Array(3).fill(""));
    } catch {
      setTeamAvatars(Array(3).fill(""));
    }
  }, [router]);

  const loadBanners = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/banners", { headers: getAuthHeaders() });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setBanners(Array.isArray(data?.banners) ? data.banners : []);
    } catch {
      setBanners([]);
    }
  }, [router]);

  useEffect(() => {
    if (!mounted) return;
    const pwd = sessionStorage.getItem(ADMIN_TOKEN);
    if (!pwd) {
      router.replace("/admin");
      return;
    }
    loadSettings();
    loadMedia();
    loadProjects();
    loadPartnerLogos();
    loadBanners();
    loadServiceImages();
    loadImmigrationProjectImages();
    loadSeo();
    loadStudyServiceImages();
    loadVisaServiceImages();
    loadSuccessWallImages();
    loadTeamAvatars();
    loadStudyHeroImage();
    loadVisaHeroImage();
    loadEnterpriseModuleImages();
    loadFooterQr();
    loadConsultQr();
  }, [mounted, router, loadSettings, loadMedia, loadProjects, loadPartnerLogos, loadBanners, loadServiceImages, loadImmigrationProjectImages, loadSeo, loadStudyServiceImages, loadVisaServiceImages, loadSuccessWallImages, loadTeamAvatars, loadStudyHeroImage, loadVisaHeroImage, loadEnterpriseModuleImages, loadFooterQr, loadConsultQr]);

  const handleLogoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoFile) return;
    setLogoLoading(true);
    try {
      const form = new FormData();
      form.append("file", logoFile);
      const res = await fetch("/api/admin/settings/logo", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json();
      if (data.logoUrl) setLogoUrl(data.logoUrl);
      setLogoFile(null);
    } finally {
      setLogoLoading(false);
    }
  };

  const handleStudyHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyHeroFile) return;
    setStudyHeroLoading(true);
    try {
      const form = new FormData();
      form.append("file", studyHeroFile);
      const res = await fetch("/api/admin/study-hero-image", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.imageUrl) setStudyHeroImageUrl(data.imageUrl);
      setStudyHeroFile(null);
    } finally {
      setStudyHeroLoading(false);
    }
  };

  const handleVisaHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visaHeroFile) return;
    setVisaHeroLoading(true);
    try {
      const form = new FormData();
      form.append("file", visaHeroFile);
      const res = await fetch("/api/admin/visa-hero-image", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.imageUrl) setVisaHeroImageUrl(data.imageUrl);
      setVisaHeroFile(null);
    } finally {
      setVisaHeroLoading(false);
    }
  };

  const handleEnterpriseModuleUpload = async (slot: "conditions" | "tax") => {
    const file = slot === "conditions" ? enterpriseConditionsFile : enterpriseTaxServiceFile;
    if (!file?.size) return;
    if (slot === "conditions") setEnterpriseConditionsLoading(true);
    else setEnterpriseTaxServiceLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("slot", slot);
      const res = await fetch("/api/admin/enterprise-module-images", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.conditionsImageUrl != null) setEnterpriseConditionsImageUrl(data.conditionsImageUrl);
      if (data?.taxServiceImageUrl != null) setEnterpriseTaxServiceImageUrl(data.taxServiceImageUrl);
      setEnterpriseConditionsFile(null);
      setEnterpriseTaxServiceFile(null);
    } finally {
      setEnterpriseConditionsLoading(false);
      setEnterpriseTaxServiceLoading(false);
    }
  };

  const handleFooterQrUpload = async (index: number) => {
    const file = footerQrFile[index];
    if (!file?.size) return;
    setFooterQrLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("index", String(index));
      const res = await fetch("/api/admin/footer-qr", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data?.qrUrls)) setFooterQrUrls(data.qrUrls);
      setFooterQrFile((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } finally {
      setFooterQrLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleConsultQrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultQrFile?.size) return;
    setConsultQrLoading(true);
    try {
      const form = new FormData();
      form.append("file", consultQrFile);
      const res = await fetch("/api/admin/consult-qr", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.imageUrl) setConsultQrImageUrl(data.imageUrl);
      setConsultQrFile(null);
    } finally {
      setConsultQrLoading(false);
    }
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) return;
    setMediaLoading(true);
    try {
      const form = new FormData();
      form.append("file", mediaFile);
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      await loadMedia();
      setMediaFile(null);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectLoading(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      const newId = data?.id;
      if (newId && projectFormImage && projectFormImage.size > 0) {
        const form = new FormData();
        form.append("file", projectFormImage);
        await fetch(`/api/admin/projects/${newId}/image`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: form,
        });
      }
      await loadProjects();
      setProjectForm({ type: "tech", hot: false, title: "", desc: "", period: "", investment: "", identity: "", language: "", budget: "" });
      setProjectFormImage(null);
      if (document.getElementById("project-form-image") instanceof HTMLInputElement) {
        (document.getElementById("project-form-image") as HTMLInputElement).value = "";
      }
    } finally {
      setProjectLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("确定删除该项目？")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE", headers: getAuthHeaders() });
    if (res.status === 401) {
      router.replace("/admin");
      return;
    }
    await loadProjects();
  };

  const handlePartnerLogoChange = (index: number, file: File | null) => {
    setPartnerLogoFile((prev) => (file ? { ...prev, [index]: file } : (() => { const next = { ...prev }; delete next[index]; return next; })()));
  };

  const handlePartnerLogoUpload = async (index: number) => {
    const file = partnerLogoFile[index];
    if (!file) return;
    setPartnerLogoLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("index", String(index));
      const res = await fetch("/api/admin/partner-schools/logo", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.logos)) {
        setPartnerLogos(data.logos);
        setPartnerLogoFile((prev) => (() => { const next = { ...prev }; delete next[index]; return next; })());
      }
    } finally {
      setPartnerLogoLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleProjectImageChange = (id: string, file: File | null) => {
    setProjectImageFile((prev) => (file ? { ...prev, [id]: file } : (() => { const next = { ...prev }; delete next[id]; return next; })()));
  };

  const handleProjectImageUpload = async (id: string) => {
    const file = projectImageFile[id];
    if (!file) return;
    setProjectImageLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/projects/${id}/image`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json();
      if (data.image_url) {
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, image_url: data.image_url } : p)));
        setProjectImageFile((prev) => (() => { const next = { ...prev }; delete next[id]; return next; })());
      }
    } finally {
      setProjectImageLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN);
    router.replace("/admin");
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerError(null);
    if (!bannerFile || !bannerFile.size) {
      setBannerError("请先选择一张背景图");
      return;
    }
    setBannerLoading(true);
    try {
      const form = new FormData();
      form.append("file", bannerFile);
      form.append("title", bannerForm.title);
      form.append("subtitle", bannerForm.subtitle);
      form.append("cta_text", bannerForm.cta_text);
      if (bannerForm.cta_link) form.append("cta_link", bannerForm.cta_link);
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      if (!res.ok) {
        setBannerError((data && typeof data.error === "string" ? data.error : null) || "添加失败，请重试");
        return;
      }
      if (Array.isArray(data.banners)) setBanners(data.banners);
      setBannerFile(null);
      setBannerForm({ title: "", subtitle: "", cta_text: "免费评估", cta_link: "" });
      if (bannerFileInputRef.current) bannerFileInputRef.current.value = "";
    } finally {
      setBannerLoading(false);
    }
  };

  const handleServiceImageUpload = async (index: number) => {
    const file = serviceImageFile[index];
    if (!file?.size) return;
    setServiceImageLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("index", String(index));
      const res = await fetch("/api/admin/recommended-project-images", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data?.images)) setServiceImages(data.images);
      setServiceImageFile((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } finally {
      setServiceImageLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleSeoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSeoLoading(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.title !== undefined) setSeo({ title: data.title, description: data.description ?? "", keywords: data.keywords ?? "", ogTitle: data.ogTitle ?? "", ogDescription: data.ogDescription ?? "", ogImage: data.ogImage ?? "" });
    } finally {
      setSeoLoading(false);
    }
  };

  const handleImmigrationProjectImageUpload = async (index: number) => {
    const file = immigrationProjectImageFile[index];
    if (!file?.size) return;
    setImmigrationProjectImageLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("index", String(index));
      const res = await fetch("/api/admin/immigration-project-images", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data?.images)) setImmigrationProjectImages(data.images);
      setImmigrationProjectImageFile((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } finally {
      setImmigrationProjectImageLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleStudyServiceImageUpload = async (index: number) => {
    const file = studyServiceImageFile[index];
    if (!file?.size) return;
    setStudyServiceImageLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("index", String(index));
      const res = await fetch("/api/admin/study-services-images", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data?.images)) setStudyServiceImages(data.images);
      setStudyServiceImageFile((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } finally {
      setStudyServiceImageLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleVisaServiceImageUpload = async (index: number) => {
    const file = visaServiceImageFile[index];
    if (!file?.size) return;
    setVisaServiceImageLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("index", String(index));
      const res = await fetch("/api/admin/visa-services-images", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data?.images)) setVisaServiceImages(data.images);
      setVisaServiceImageFile((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } finally {
      setVisaServiceImageLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleSuccessWallImageUpload = async (index: number) => {
    const file = successWallImageFile[index];
    if (!file?.size) return;
    setSuccessWallImageLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("index", String(index));
      const res = await fetch("/api/admin/success-wall-images", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data?.images)) setSuccessWallImages(data.images);
      setSuccessWallImageFile((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } finally {
      setSuccessWallImageLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleTeamAvatarUpload = async (index: number) => {
    const file = teamAvatarFile[index];
    if (!file?.size) return;
    setTeamAvatarLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("index", String(index));
      const res = await fetch("/api/admin/team-avatars", {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data?.avatars)) setTeamAvatars(data.avatars);
      setTeamAvatarFile((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } finally {
      setTeamAvatarLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleBannerDelete = async (index: number) => {
    if (!confirm("确定删除这条 Banner？")) return;
    const res = await fetch(`/api/admin/banners?index=${index}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      router.replace("/admin");
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (Array.isArray(data?.banners)) setBanners(data.banners);
  };

  if (!mounted) return null;

  const labelClass = "block text-sm font-medium text-gray-700 mb-2";
  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 outline-none transition";
  const btnPrimary = "rounded-xl bg-brand px-5 py-2.5 text-white text-sm font-medium hover:bg-brand-dark disabled:opacity-50 transition";
  const sectionHead = "border-l-4 border-brand bg-brand/5 px-6 py-4";
  const sectionBody = "p-6";

  const navItems = [
    { id: "banners", label: "首页 Banner" },
    { id: "service-images", label: "首页推荐项目图片（只传图）" },
    { id: "study-service-images", label: "推荐留学服务图片（6 张卡）" },
    { id: "study-hero", label: "留学规划页头部背景" },
    { id: "visa-hero", label: "签证服务页头部背景" },
    { id: "enterprise-module-images", label: "企业服务页模块图片" },
    { id: "visa-service-images", label: "推荐签证服务图片（6 张卡）" },
    { id: "success-wall-images", label: "成功获批展示图片（10 格）" },
    { id: "team-avatars", label: "服务团队头像（3 位顾问）" },
    { id: "logo", label: "网站 Logo" },
    { id: "seo", label: "网站 SEO" },
    { id: "footer-qr", label: "Footer 二维码" },
    { id: "consult-qr", label: "在线咨询二维码" },
    { id: "media", label: "图片库" },
    { id: "partner-logos", label: "合作院校 Logo" },
    { id: "projects", label: "移民项目" },
    { id: "immigration-project-images", label: "移民页项目卡片图片" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-brand text-white shadow shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">简单移民咨询</span>
            <span className="text-white/70">·</span>
            <span className="text-sm text-white/90">后台管理</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-white/90 hover:text-white transition">返回首页</Link>
            <button type="button" onClick={logout} className="text-white/90 hover:text-white transition">退出</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* 左侧目录（桌面端） */}
        <aside className="hidden md:block w-52 shrink-0 bg-white border-r border-gray-200 shadow-sm py-6 sticky top-0 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="px-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">目录</h3>
            <ul className="space-y-0.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-brand transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 sm:py-8 space-y-6 max-w-3xl">
          {/* 小屏顶部目录 */}
          <nav className="md:hidden flex flex-wrap gap-2 pb-2 border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-500 w-full py-1">目录</span>
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="text-sm font-medium text-gray-700 hover:text-brand px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-brand/30 transition">
                {item.label}
              </a>
            ))}
          </nav>
        {/* 首页 Banner */}
        <section id="banners" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">首页 Banner</h2>
            <p className="text-xs text-gray-500 mt-1">上传背景图与文案，首页轮播将按顺序展示；未上传时使用默认文案</p>
          </div>
          <div className={sectionBody}>
            <form onSubmit={handleBannerSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div className="sm:col-span-2">
                <label className={labelClass}>背景图（必选）</label>
                <input
                  ref={bannerFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setBannerFile(e.target.files?.[0] ?? null);
                    setBannerError(null);
                  }}
                  className="sr-only"
                  id="banner-file-input"
                />
                <label
                  htmlFor="banner-file-input"
                  className="flex items-center justify-center gap-2 w-full min-h-[120px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/80 hover:border-brand hover:bg-brand/5 cursor-pointer transition text-gray-600 hover:text-brand"
                >
                  <span className="text-lg">📷</span>
                  <span className="font-medium">
                    {bannerFile ? `已选择：${bannerFile.name}` : "点击此处选择背景图"}
                  </span>
                </label>
              </div>
              <div>
                <label className={labelClass}>标题</label>
                <input placeholder="如：持牌顾问·合规高效" value={bannerForm.title} onChange={(e) => setBannerForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>按钮文字</label>
                <input placeholder="如：免费评估" value={bannerForm.cta_text} onChange={(e) => setBannerForm((f) => ({ ...f, cta_text: e.target.value }))} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>副标题</label>
                <input placeholder="如：专注加拿大移民与留学，为每一位客户定制最优方案" value={bannerForm.subtitle} onChange={(e) => setBannerForm((f) => ({ ...f, subtitle: e.target.value }))} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>按钮链接（选填，不填则跳转 #contact）</label>
                <input placeholder="#contact 或 /about" value={bannerForm.cta_link} onChange={(e) => setBannerForm((f) => ({ ...f, cta_link: e.target.value }))} className={inputClass} />
              </div>
              <div className="sm:col-span-2 flex flex-col items-end gap-2 pt-1">
                {bannerError && <p className="text-sm text-red-600 w-full">{bannerError}</p>}
                <button type="submit" disabled={!bannerFile || bannerLoading} className={btnPrimary}>{bannerLoading ? "上传中…" : "添加 Banner"}</button>
                {!bannerFile && <p className="text-xs text-gray-400">请先在上方「背景图」区域点击选择一张图片，添加按钮才会可点击</p>}
              </div>
            </form>
            <ul className="border-t border-gray-100 pt-4 space-y-3">
              {banners.filter((b) => b && typeof b === "object").map((b, i) => (
                <li key={i} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
                  <div className="h-14 w-24 shrink-0 rounded-lg bg-gray-200 overflow-hidden">
                    <img src={typeof b.image_url === "string" ? b.image_url : ""} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-gray-900 block truncate">{typeof b.title === "string" ? b.title : "（无标题）"}</span>
                    <span className="text-gray-500 text-xs block truncate">{typeof b.subtitle === "string" ? b.subtitle : "—"}</span>
                    <span className="text-brand text-xs">{typeof b.cta_text === "string" ? b.cta_text : ""}</span>
                  </div>
                  <button type="button" onClick={() => handleBannerDelete(i)} className="shrink-0 text-red-600 font-medium hover:underline">删除</button>
                </li>
              ))}
              {banners.length === 0 && <p className="text-gray-500 text-sm py-4 text-center">暂无 Banner，首页将显示默认轮播文案</p>}
            </ul>
          </div>
        </section>

        {/* 首页推荐项目图片：8 张卡片只上传图，文案固定 */}
        <section id="service-images" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">首页推荐项目图片</h2>
            <p className="text-xs text-gray-500 mt-1">首页「推荐移民项目」共 8 张卡片，文案固定不变；此处只上传/更换每张卡片的图片，第 1 条对应第 1 张卡，依此类推</p>
          </div>
          <div className={sectionBody}>
            <ul className="space-y-3">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                <li key={index} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-brand/15 text-brand flex items-center justify-center text-xs font-semibold">{index + 1}</span>
                  <div className="h-14 w-24 shrink-0 rounded-lg bg-gray-200 overflow-hidden">
                    {serviceImages[index] ? (
                      <img src={serviceImages[index]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-gray-500 text-xs">第 {index + 1} 张卡片</div>
                  <div className="shrink-0 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setServiceImageFile((prev) => (e.target.files?.[0] ? { ...prev, [index]: e.target.files[0] } : (() => { const n = { ...prev }; delete n[index]; return n; })()))}
                      className="hidden"
                      id={`service-img-${index}`}
                    />
                    <label htmlFor={`service-img-${index}`} className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">选择图片</label>
                    <button
                      type="button"
                      disabled={!serviceImageFile[index] || serviceImageLoading[index]}
                      onClick={() => handleServiceImageUpload(index)}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      {serviceImageLoading[index] ? "上传中…" : "上传"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 首页推荐留学服务图片：6 张卡片只上传图 */}
        <section id="study-service-images" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">推荐留学服务图片（首页 6 张卡片）</h2>
            <p className="text-xs text-gray-500 mt-1">即首页「推荐留学服务」模块的 6 张卡片图，文案固定不变，此处只上传/更换图片；第 1 条=第 1 张卡，第 6 条=第 6 张卡</p>
          </div>
          <div className={sectionBody}>
            <ul className="space-y-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <li key={index} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-brand/15 text-brand flex items-center justify-center text-xs font-semibold">{index + 1}</span>
                  <div className="h-14 w-24 shrink-0 rounded-lg bg-gray-200 overflow-hidden">
                    {studyServiceImages[index] ? (
                      <img src={studyServiceImages[index]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-gray-500 text-xs">第 {index + 1} 张卡片</div>
                  <div className="shrink-0 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setStudyServiceImageFile((prev) => (e.target.files?.[0] ? { ...prev, [index]: e.target.files[0] } : (() => { const n = { ...prev }; delete n[index]; return n; })()))}
                      className="hidden"
                      id={`study-service-img-${index}`}
                    />
                    <label htmlFor={`study-service-img-${index}`} className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">选择图片</label>
                    <button
                      type="button"
                      disabled={!studyServiceImageFile[index] || studyServiceImageLoading[index]}
                      onClick={() => handleStudyServiceImageUpload(index)}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      {studyServiceImageLoading[index] ? "上传中…" : "上传"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 留学规划页头部背景图 */}
        <section id="study-hero" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">留学规划页头部背景</h2>
            <p className="text-xs text-gray-500 mt-1">即 /study 页面顶部「留学规划」标题区的背景图，未上传时使用默认图</p>
          </div>
          <div className={sectionBody}>
            {studyHeroImageUrl ? (
              <div className="mb-4 rounded-xl border border-gray-200 overflow-hidden bg-gray-100">
                <img src={studyHeroImageUrl} alt="当前背景" className="w-full max-h-48 object-cover" />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">当前未上传，前台将显示默认背景图</p>
            )}
            <form onSubmit={handleStudyHeroSubmit} className="flex flex-wrap items-end gap-3">
              <label className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                {studyHeroFile ? `已选：${studyHeroFile.name}` : "选择背景图"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setStudyHeroFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <button type="submit" disabled={!studyHeroFile || studyHeroLoading} className={btnPrimary}>
                {studyHeroLoading ? "上传中…" : "上传"}
              </button>
            </form>
          </div>
        </section>

        {/* 签证服务页头部背景图 */}
        <section id="visa-hero" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">签证服务页头部背景</h2>
            <p className="text-xs text-gray-500 mt-1">即 /visa 页面顶部「加拿大签证服务」标题区的背景图，未上传时使用默认图</p>
          </div>
          <div className={sectionBody}>
            {visaHeroImageUrl ? (
              <div className="mb-4 rounded-xl border border-gray-200 overflow-hidden bg-gray-100">
                <img src={visaHeroImageUrl} alt="当前背景" className="w-full max-h-48 object-cover" />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">当前未上传，前台将显示默认背景图</p>
            )}
            <form onSubmit={handleVisaHeroSubmit} className="flex flex-wrap items-end gap-3">
              <label className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                {visaHeroFile ? `已选：${visaHeroFile.name}` : "选择背景图"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setVisaHeroFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <button type="submit" disabled={!visaHeroFile || visaHeroLoading} className={btnPrimary}>
                {visaHeroLoading ? "上传中…" : "上传"}
              </button>
            </form>
          </div>
        </section>

        {/* 企业服务页两个模块图片：申请条件、企业报税服务 */}
        <section id="enterprise-module-images" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">企业服务页模块图片</h2>
            <p className="text-xs text-gray-500 mt-1">即 /enterprise 页「加拿大企业服务申请条件」与「企业报税服务」两个模块的配图，未上传时使用默认图</p>
          </div>
          <div className={sectionBody}>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 px-4 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="shrink-0 w-full sm:w-40 h-28 rounded-lg bg-gray-200 overflow-hidden">
                  {enterpriseConditionsImageUrl ? (
                    <img src={enterpriseConditionsImageUrl} alt="申请条件" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">加拿大企业服务申请条件</p>
                  <p className="text-xs text-gray-500 mt-0.5">左侧大图</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <label className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                      {enterpriseConditionsFile ? `已选：${enterpriseConditionsFile.name}` : "选择图片"}
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => setEnterpriseConditionsFile(e.target.files?.[0] ?? null)} />
                    </label>
                    <button type="button" disabled={!enterpriseConditionsFile || enterpriseConditionsLoading} onClick={() => handleEnterpriseModuleUpload("conditions")} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50">
                      {enterpriseConditionsLoading ? "上传中…" : "上传"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 px-4 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="shrink-0 w-full sm:w-40 h-28 rounded-lg bg-gray-200 overflow-hidden">
                  {enterpriseTaxServiceImageUrl ? (
                    <img src={enterpriseTaxServiceImageUrl} alt="企业报税" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">企业报税服务</p>
                  <p className="text-xs text-gray-500 mt-0.5">右侧大图</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <label className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                      {enterpriseTaxServiceFile ? `已选：${enterpriseTaxServiceFile.name}` : "选择图片"}
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => setEnterpriseTaxServiceFile(e.target.files?.[0] ?? null)} />
                    </label>
                    <button type="button" disabled={!enterpriseTaxServiceFile || enterpriseTaxServiceLoading} onClick={() => handleEnterpriseModuleUpload("tax")} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50">
                      {enterpriseTaxServiceLoading ? "上传中…" : "上传"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 推荐签证服务图片：首页 4 张 + 签证页 6 张（含超级签证、毕业工签） */}
        <section id="visa-service-images" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">推荐签证服务图片（6 张卡）</h2>
            <p className="text-xs text-gray-500 mt-1">首页「推荐签证服务」用第 1～4 张；签证页「推荐签证」列表用全部 6 张，第 5 张=超级签证、第 6 张=毕业工签。此处只上传/更换图片。</p>
          </div>
          <div className={sectionBody}>
            <ul className="space-y-3">
              {[
                { index: 0, label: "第 1 张（首页+签证页）" },
                { index: 1, label: "第 2 张（首页+签证页）" },
                { index: 2, label: "第 3 张（首页+签证页）" },
                { index: 3, label: "第 4 张（首页+签证页）" },
                { index: 4, label: "第 5 张（签证页·超级签证）" },
                { index: 5, label: "第 6 张（签证页·毕业工签）" },
              ].map(({ index, label }) => (
                <li key={index} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-brand/15 text-brand flex items-center justify-center text-xs font-semibold">{index + 1}</span>
                  <div className="h-14 w-24 shrink-0 rounded-lg bg-gray-200 overflow-hidden">
                    {visaServiceImages[index] ? (
                      <img src={visaServiceImages[index]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-gray-500 text-xs">{label}</div>
                  <div className="shrink-0 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setVisaServiceImageFile((prev) => (e.target.files?.[0] ? { ...prev, [index]: e.target.files[0] } : (() => { const n = { ...prev }; delete n[index]; return n; })()))}
                      className="hidden"
                      id={`visa-service-img-${index}`}
                    />
                    <label htmlFor={`visa-service-img-${index}`} className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">选择图片</label>
                    <button
                      type="button"
                      disabled={!visaServiceImageFile[index] || visaServiceImageLoading[index]}
                      onClick={() => handleVisaServiceImageUpload(index)}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      {visaServiceImageLoading[index] ? "上传中…" : "上传"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 首页成功获批展示图片：10 格只上传图 */}
        <section id="success-wall-images" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">成功获批展示图片（首页 10 格）</h2>
            <p className="text-xs text-gray-500 mt-1">即首页「成功获批展示」模块的 10 个格子（EE 获批、省提名、枫叶卡…），文案固定；此处只上传/更换每格图片，未上传则显示默认勾选图标</p>
          </div>
          <div className={sectionBody}>
            <ul className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                <li key={index} className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
                  <span className="text-xs font-medium text-gray-500">第 {index + 1} 格</span>
                  <div className="h-14 w-20 shrink-0 rounded-lg bg-gray-200 overflow-hidden">
                    {successWallImages[index] ? (
                      <img src={successWallImages[index]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSuccessWallImageFile((prev) => (e.target.files?.[0] ? { ...prev, [index]: e.target.files[0] } : (() => { const n = { ...prev }; delete n[index]; return n; })()))}
                      className="hidden"
                      id={`success-wall-img-${index}`}
                    />
                    <label htmlFor={`success-wall-img-${index}`} className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">选择</label>
                    <button
                      type="button"
                      disabled={!successWallImageFile[index] || successWallImageLoading[index]}
                      onClick={() => handleSuccessWallImageUpload(index)}
                      className="rounded bg-brand px-2 py-1 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      {successWallImageLoading[index] ? "上传中…" : "上传"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 服务团队头像：3 位顾问 */}
        <section id="team-avatars" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">服务团队头像（3 位顾问）</h2>
            <p className="text-xs text-gray-500 mt-1">即首页「服务团队」模块三位顾问的圆形头像，第 1 位=移民律师Lisa，第 2 位=移民顾问Bob，第 3 位=留学规划师Susan；未上传则显示姓名首字</p>
          </div>
          <div className={sectionBody}>
            <ul className="space-y-4">
              {[
                { index: 0, label: "第 1 位（移民律师Lisa）" },
                { index: 1, label: "第 2 位（移民顾问Bob）" },
                { index: 2, label: "第 3 位（留学规划师Susan）" },
              ].map(({ index, label }) => (
                <li key={index} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow">
                    {teamAvatars[index] ? (
                      <img src={teamAvatars[index]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-gray-700 font-medium">{label}</div>
                  <div className="shrink-0 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTeamAvatarFile((prev) => (e.target.files?.[0] ? { ...prev, [index]: e.target.files[0] } : (() => { const n = { ...prev }; delete n[index]; return n; })()))}
                      className="hidden"
                      id={`team-avatar-${index}`}
                    />
                    <label htmlFor={`team-avatar-${index}`} className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">选择头像</label>
                    <button
                      type="button"
                      disabled={!teamAvatarFile[index] || teamAvatarLoading[index]}
                      onClick={() => handleTeamAvatarUpload(index)}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      {teamAvatarLoading[index] ? "上传中…" : "上传"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 一、网站 Logo：标题区 + 内容区（预览固定高度 + 表单一行：文件 | 按钮） */}
        <section id="logo" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">网站 Logo</h2>
            <p className="text-xs text-gray-500 mt-1">上传后将显示在站点头部</p>
          </div>
          <div className={sectionBody}>
            {logoUrl && (
              <div className="mb-6 h-14 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
                <img src={logoUrl} alt="Logo" className="max-h-10 w-auto object-contain" />
              </div>
            )}
            <form onSubmit={handleLogoSubmit} className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1 min-w-0">
                <label className={labelClass}>选择图片</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand file:hover:bg-brand/20"
                />
              </div>
              <button type="submit" disabled={!logoFile || logoLoading} className={btnPrimary + " shrink-0 sm:w-auto w-full sm:max-w-[140px]"}>{logoLoading ? "上传中…" : "上传 Logo"}</button>
            </form>
          </div>
        </section>

        {/* 网站 SEO：标题、描述、关键词、Open Graph，利于 Google 收录与分享预览 */}
        <section id="seo" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">网站 SEO</h2>
            <p className="text-xs text-gray-500 mt-1">设置全站默认标题、描述与关键词，用于 Google 等搜索引擎收录；OG 用于微信/社交分享时的预览。留空则使用系统默认文案。</p>
          </div>
          <div className={sectionBody}>
            <form onSubmit={handleSeoSave} className="space-y-4">
              <div>
                <label className={labelClass}>网站标题（title）</label>
                <input placeholder="如：简单移民咨询 | 加拿大移民 Express Entry PNP 专业顾问" value={seo.title} onChange={(e) => setSeo((s) => ({ ...s, title: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>网站描述（description）</label>
                <textarea placeholder="如：简单移民咨询有限公司提供加拿大移民专业服务：Express Entry、CEC、省提名PNP、学签转移民。持牌顾问，合规高效。" value={seo.description} onChange={(e) => setSeo((s) => ({ ...s, description: e.target.value }))} className={inputClass} rows={3} />
              </div>
              <div>
                <label className={labelClass}>关键词（keywords，逗号分隔）</label>
                <input placeholder="如：加拿大移民, Express Entry, PNP, 省提名, CEC, 移民咨询" value={seo.keywords} onChange={(e) => setSeo((s) => ({ ...s, keywords: e.target.value }))} className={inputClass} />
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">分享预览（Open Graph，微信/社交链接用）</p>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>OG 标题</label>
                    <input placeholder="留空则用上面「网站标题」" value={seo.ogTitle} onChange={(e) => setSeo((s) => ({ ...s, ogTitle: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>OG 描述</label>
                    <input placeholder="留空则用上面「网站描述」" value={seo.ogDescription} onChange={(e) => setSeo((s) => ({ ...s, ogDescription: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>OG 图片 URL（选填，分享时显示的图）</label>
                    <input placeholder="https://..." value={seo.ogImage} onChange={(e) => setSeo((s) => ({ ...s, ogImage: e.target.value }))} className={inputClass} />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={seoLoading} className={btnPrimary}>{seoLoading ? "保存中…" : "保存 SEO 设置"}</button>
            </form>
          </div>
        </section>

        {/* Footer 扫码关注：两个二维码 */}
        <section id="footer-qr" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">Footer 二维码（扫码关注）</h2>
            <p className="text-xs text-gray-500 mt-1">页脚「扫码关注」栏的两个二维码图，上传后前台按顺序显示；未上传时显示占位</p>
          </div>
          <div className={sectionBody}>
            <div className="flex flex-wrap gap-6">
              {[0, 1].map((index) => (
                <div key={index} className="flex flex-col items-start gap-3 py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">第 {index + 1} 个二维码</span>
                  <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                    {footerQrUrls[index] ? (
                      <img src={footerQrUrls[index]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      {footerQrFile[index] ? `已选：${footerQrFile[index].name}` : "选择图片"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => setFooterQrFile((prev) => (e.target.files?.[0] ? { ...prev, [index]: e.target.files[0] } : (() => { const n = { ...prev }; delete n[index]; return n; })()))}
                      />
                    </label>
                    <button
                      type="button"
                      disabled={!footerQrFile[index] || footerQrLoading[index]}
                      onClick={() => handleFooterQrUpload(index)}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      {footerQrLoading[index] ? "上传中…" : "上传"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 在线咨询弹窗二维码：「24小时 在线咨询」卡片 */}
        <section id="consult-qr" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">在线咨询二维码</h2>
            <p className="text-xs text-gray-500 mt-1">首页左下角「24小时 在线咨询」弹窗内的二维码图，未上传时尝试显示 public/qr-consult.png，否则显示占位</p>
          </div>
          <div className={sectionBody}>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                {consultQrImageUrl ? (
                  <img src={consultQrImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                )}
              </div>
              <form onSubmit={handleConsultQrSubmit} className="flex flex-wrap items-end gap-3">
                <label className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  {consultQrFile ? `已选：${consultQrFile.name}` : "选择图片"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setConsultQrFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <button type="submit" disabled={!consultQrFile || consultQrLoading} className={btnPrimary}>
                  {consultQrLoading ? "上传中…" : "上传"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 二、图片库：标题区 + 内容区（表单一行：文件 | 按钮）+ 列表（统一行高） */}
        <section id="media" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">图片库</h2>
            <p className="text-xs text-gray-500 mt-1">上传图片后可复制链接用于页面</p>
          </div>
          <div className={sectionBody}>
            <form onSubmit={handleMediaSubmit} className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
              <div className="flex-1 min-w-0">
                <label className={labelClass}>选择图片</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand file:hover:bg-brand/20"
                />
              </div>
              <button type="submit" disabled={!mediaFile || mediaLoading} className={btnPrimary + " shrink-0 sm:w-auto w-full sm:max-w-[140px]"}>{mediaLoading ? "上传中…" : "上传图片"}</button>
            </form>
            <ul className="border-t border-gray-100 pt-4 space-y-3">
              {mediaItems.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
                  <img src={item.url} alt={item.name} className="h-12 w-12 object-cover rounded-lg shrink-0" />
                  <span className="flex-1 min-w-0 truncate text-gray-700">{item.name}</span>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-brand font-medium hover:underline">复制链接</a>
                </li>
              ))}
              {mediaItems.length === 0 && <p className="text-gray-500 text-sm py-4 text-center">暂无图片</p>}
            </ul>
          </div>
        </section>

        {/* 合作院校 Logo：留学页「合作院校」区块展示 */}
        <section id="partner-logos" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">合作院校 Logo</h2>
            <p className="text-xs text-gray-500 mt-1">留学页「合作院校」展示的 6 所院校 logo，上传后前台按顺序显示</p>
          </div>
          <div className={sectionBody}>
            <ul className="space-y-3">
              {["多伦多大学", "UBC", "麦吉尔大学", "滑铁卢大学", "阿尔伯塔大学", "西安大略大学"].map((name, index) => (
                <li key={index} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
                  <div className="h-14 w-24 shrink-0 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center">
                    {partnerLogos[index] ? (
                      <img src={partnerLogos[index]} alt={name} className="h-full w-full object-contain p-1" />
                    ) : (
                      <span className="text-gray-400 text-xs">未上传</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 font-medium text-gray-900">{name}</div>
                  <div className="shrink-0 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePartnerLogoChange(index, e.target.files?.[0] ?? null)}
                      className="hidden"
                      id={`partner-logo-${index}`}
                    />
                    <label htmlFor={`partner-logo-${index}`} className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      选择
                    </label>
                    <button
                      type="button"
                      disabled={!partnerLogoFile[index] || partnerLogoLoading[index]}
                      onClick={() => handlePartnerLogoUpload(index)}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      {partnerLogoLoading[index] ? "上传中…" : "上传"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 三、移民项目：标题区 + 表单网格（统一 2 列 + 全宽行）+ 列表 */}
        <section id="projects" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">移民项目</h2>
            <p className="text-xs text-amber-700 mt-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
              <strong>只换图片？</strong> 若您只想更换首页 8 张卡片的图片、不改文案和顺序，请用左侧 <strong>「首页推荐项目图片」</strong>，那里只需选择图片 + 上传，无需填写任何文字。
            </p>
            <p className="text-xs text-gray-500 mt-1">本模块用于添加/删除完整项目（标题、周期等）；添加时可选填项目图片，也可在下方列表中为已有项目上传/更换图片</p>
          </div>
          <div className={sectionBody}>
            <form onSubmit={handleAddProject} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div>
                <label className={labelClass}>类型</label>
                <input placeholder="tech / invest / startup / family / study / other" value={projectForm.type} onChange={(e) => setProjectForm((f) => ({ ...f, type: e.target.value }))} className={inputClass} />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer h-[42px]">
                  <input type="checkbox" checked={projectForm.hot} onChange={(e) => setProjectForm((f) => ({ ...f, hot: e.target.checked }))} className="rounded border-gray-300 text-brand focus:ring-brand/20" />
                  热门
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>标题</label>
                <input placeholder="项目标题" value={projectForm.title} onChange={(e) => setProjectForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>描述</label>
                <textarea placeholder="项目描述" value={projectForm.desc} onChange={(e) => setProjectForm((f) => ({ ...f, desc: e.target.value }))} className={inputClass} rows={2} />
              </div>
              <div>
                <label className={labelClass}>周期</label>
                <input placeholder="如 6-12 个月" value={projectForm.period} onChange={(e) => setProjectForm((f) => ({ ...f, period: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>投资</label>
                <input placeholder="如 无 / 按项目" value={projectForm.investment} onChange={(e) => setProjectForm((f) => ({ ...f, investment: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>身份</label>
                <input placeholder="如 永久居民" value={projectForm.identity} onChange={(e) => setProjectForm((f) => ({ ...f, identity: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>语言</label>
                <input placeholder="如 雅思 5.0" value={projectForm.language} onChange={(e) => setProjectForm((f) => ({ ...f, language: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>预算</label>
                <input placeholder="如 40 万人民币起" value={projectForm.budget} onChange={(e) => setProjectForm((f) => ({ ...f, budget: e.target.value }))} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>项目图片（选填，首页/移民页卡片展示）</label>
                <input
                  id="project-form-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProjectFormImage(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand file:hover:bg-brand/20"
                />
                {projectFormImage && <p className="mt-1 text-xs text-gray-500">已选择：{projectFormImage.name}</p>}
              </div>
              <div className="sm:col-span-2 flex flex-col items-end gap-2 pt-1">
                {!projectForm.title.trim() && (
                  <p className="text-amber-600 text-sm w-full">请至少填写「标题」，添加项目按钮才会可点击；图片为选填。</p>
                )}
                <button type="submit" disabled={projectLoading || !projectForm.title.trim()} className={btnPrimary}>{projectLoading ? "添加中…" : "添加项目"}</button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-1 mb-3 border-t border-gray-100 pt-3">下方列表顺序即首页「推荐移民项目」卡片顺序：第 1 条 = 第 1 张卡，第 2 条 = 第 2 张卡……最多展示前 8 条。</p>
            <ul className="space-y-3">
              {projects.map((p, index) => (
                <li key={p.id} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-brand/15 text-brand flex items-center justify-center text-xs font-semibold" title="首页第几张卡片">{index + 1}</span>
                  <div className="h-12 w-24 shrink-0 rounded-lg bg-gray-200 overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-gray-900 truncate block">{p.title}</span>
                    <span className="text-gray-500 text-xs">{p.type}</span>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProjectImageChange(p.id, e.target.files?.[0] ?? null)}
                      className="hidden"
                      id={`project-img-${p.id}`}
                    />
                    <label htmlFor={`project-img-${p.id}`} className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      选择图片
                    </label>
                    <button
                      type="button"
                      disabled={!projectImageFile[p.id] || projectImageLoading[p.id]}
                      onClick={() => handleProjectImageUpload(p.id)}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      {projectImageLoading[p.id] ? "上传中…" : "上传"}
                    </button>
                    <button type="button" onClick={() => handleDeleteProject(p.id)} className="text-red-600 font-medium hover:underline">删除</button>
                  </div>
                </li>
              ))}
              {projects.length === 0 && <p className="text-gray-500 text-sm py-6 text-center">暂无项目（前台将显示文案中的默认列表）</p>}
            </ul>
          </div>
        </section>

        {/* 移民页项目卡片图片：12 张按顺序，仅上传图，对应 /immigration 列表每张卡 */}
        <section id="immigration-project-images" className="rounded-2xl bg-white shadow-sm border border-gray-200/80 overflow-hidden scroll-mt-4">
          <div className={sectionHead}>
            <h2 className="text-base font-semibold text-gray-900">移民页项目卡片图片</h2>
            <p className="text-xs text-gray-500 mt-1">即 /immigration 页面「共 N 个移民项目」列表中每张卡片的配图，按顺序 12 张；第 1 条=第 1 张卡（如 CEC），第 2 条=第 2 张卡……未上传时前台使用默认占位图</p>
          </div>
          <div className={sectionBody}>
            <ul className="space-y-3">
              {Array.from({ length: 12 }, (_, index) => (
                <li key={index} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-brand/15 text-brand flex items-center justify-center text-xs font-semibold">{index + 1}</span>
                  <div className="h-14 w-24 shrink-0 rounded-lg bg-gray-200 overflow-hidden">
                    {immigrationProjectImages[index] ? (
                      <img src={immigrationProjectImages[index]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">未上传</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-gray-500 text-xs">第 {index + 1} 张卡片</div>
                  <div className="shrink-0 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImmigrationProjectImageFile((prev) => (e.target.files?.[0] ? { ...prev, [index]: e.target.files[0] } : (() => { const n = { ...prev }; delete n[index]; return n; })()))}
                      className="hidden"
                      id={`immigration-project-img-${index}`}
                    />
                    <label htmlFor={`immigration-project-img-${index}`} className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">选择图片</label>
                    <button
                      type="button"
                      disabled={!immigrationProjectImageFile[index] || immigrationProjectImageLoading[index]}
                      onClick={() => handleImmigrationProjectImageUpload(index)}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      {immigrationProjectImageLoading[index] ? "上传中…" : "上传"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        </main>
      </div>
    </div>
  );
}
