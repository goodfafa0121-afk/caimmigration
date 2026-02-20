/**
 * Express Entry 邀请轮次数据
 * 数据来源：加拿大 IRCC 官网 Ministerial instructions（部长指令）
 * https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds.html
 * 更新时请从上述页面核对并替换。最后核对：2026-02-18（与官网一致）。
 */
export type DrawRow = {
  round: number;
  date: string;
  category: string;
  categoryEn: string;
  score: number;
  count: number;
};

export const eeDrawsData: DrawRow[] = [
  { round: 396, date: "2026-02-17", category: "CEC经验类", categoryEn: "Canadian Experience Class", score: 508, count: 6000 },
  { round: 395, date: "2026-02-16", category: "PNP省提名", categoryEn: "Provincial Nominee Program", score: 789, count: 279 },
  { round: 394, date: "2026-02-06", category: "法语 (2026类别)", categoryEn: "French-language proficiency (2026 category)", score: 400, count: 8500 },
  { round: 393, date: "2026-02-03", category: "PNP省提名", categoryEn: "Provincial Nominee Program", score: 749, count: 423 },
  { round: 392, date: "2026-01-21", category: "CEC经验类", categoryEn: "Canadian Experience Class", score: 509, count: 6000 },
  { round: 391, date: "2026-01-20", category: "PNP省提名", categoryEn: "Provincial Nominee Program", score: 746, count: 681 },
  { round: 390, date: "2026-01-07", category: "CEC经验类", categoryEn: "Canadian Experience Class", score: 511, count: 8000 },
  { round: 389, date: "2026-01-05", category: "PNP省提名", categoryEn: "Provincial Nominee Program", score: 711, count: 574 },
  { round: 388, date: "2025-12-17", category: "法语", categoryEn: "French language proficiency", score: 399, count: 6000 },
  { round: 387, date: "2025-12-16", category: "CEC经验类", categoryEn: "Canadian Experience Class", score: 515, count: 5000 },
  { round: 386, date: "2025-12-15", category: "PNP省提名", categoryEn: "Provincial Nominee Program", score: 731, count: 399 },
  { round: 385, date: "2025-12-11", category: "医疗与社会服务", categoryEn: "Healthcare and social services", score: 476, count: 1000 },
  { round: 384, date: "2025-12-10", category: "CEC经验类", categoryEn: "Canadian Experience Class", score: 520, count: 6000 },
  { round: 383, date: "2025-12-08", category: "PNP省提名", categoryEn: "Provincial Nominee Program", score: 729, count: 1123 },
  { round: 382, date: "2025-11-28", category: "法语", categoryEn: "French language proficiency", score: 408, count: 6000 },
  { round: 381, date: "2025-11-26", category: "CEC经验类", categoryEn: "Canadian Experience Class", score: 531, count: 1000 },
  { round: 380, date: "2025-11-25", category: "PNP省提名", categoryEn: "Provincial Nominee Program", score: 699, count: 777 },
  { round: 379, date: "2025-11-14", category: "医疗与社会服务", categoryEn: "Healthcare and social services", score: 462, count: 3500 },
  { round: 378, date: "2025-11-12", category: "CEC经验类", categoryEn: "Canadian Experience Class", score: 533, count: 1000 },
  { round: 377, date: "2025-11-10", category: "PNP省提名", categoryEn: "Provincial Nominee Program", score: 738, count: 714 },
  { round: 376, date: "2025-10-29", category: "法语", categoryEn: "French language proficiency", score: 416, count: 6000 },
  { round: 375, date: "2025-10-28", category: "CEC经验类", categoryEn: "Canadian Experience Class", score: 533, count: 1000 },
  { round: 374, date: "2025-10-27", category: "PNP省提名", categoryEn: "Provincial Nominee Program", score: 761, count: 302 },
  { round: 373, date: "2025-10-15", category: "医疗与社会服务", categoryEn: "Healthcare and social services", score: 472, count: 2500 },
  { round: 372, date: "2025-10-14", category: "PNP省提名", categoryEn: "Provincial Nominee Program", score: 778, count: 345 },
  { round: 371, date: "2025-10-06", category: "法语", categoryEn: "French language proficiency", score: 432, count: 4500 },
  { round: 370, date: "2025-10-01", category: "CEC经验类", categoryEn: "Canadian Experience Class", score: 534, count: 1000 },
];
