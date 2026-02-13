// ============================================
// Mock Notifications for Worker Dashboard
// ============================================

import { getCurrentWorker } from "@/app/dummy/dummy-workers";

export interface ProviderNotification {
  id: string;
  type: "new-job" | "job-accepted" | "job-cancelled" | "payment" | "review" | "message" | "system";
  title: string;
  titleUrdu: string;
  body: string;
  bodyUrdu: string;
  isRead: boolean;
  createdAt: string;
  orderId?: string;
}

// ── Notifications for approved workers ──

const approvedWorkerNotifications: ProviderNotification[] = [
  {
    id: "n1",
    type: "new-job",
    title: "🆕 New Job Request!",
    titleUrdu: "🆕 نیا کام کی درخواست!",
    body: "Sara Ahmed needs Home Wiring Repair in Gulshan-e-Iqbal. Tap to view details.",
    bodyUrdu: "سارہ احمد کو گلشن اقبال میں ہوم وائرنگ ریپیئر کی ضرورت ہے۔ تفصیلات دیکھیں۔",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
    orderId: "30001",
  },
  {
    id: "n2",
    type: "new-job",
    title: "🆕 New Job Request!",
    titleUrdu: "🆕 نیا کام کی درخواست!",
    body: "Fatima Ali needs Circuit Breaker Repair in Clifton Block 5. Budget: Rs. 5,000",
    bodyUrdu: "فاطمہ علی کو کلفٹن بلاک 5 میں سرکٹ بریکر ریپیئر چاہیے۔ بجٹ: 5,000 روپے",
    isRead: false,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
    orderId: "30003",
  },
  {
    id: "n3",
    type: "payment",
    title: "💰 Payment Received",
    titleUrdu: "💰 ادائیگی موصول",
    body: "Rs. 15,000 credited for Full House Wiring job by Bilal Raza.",
    bodyUrdu: "بلال رضا کے فل ہاؤس وائرنگ جاب کی 15,000 روپے کی ادائیگی موصول ہوئی۔",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    orderId: "29001",
  },
  {
    id: "n4",
    type: "review",
    title: "⭐ New 5-Star Review!",
    titleUrdu: "⭐ نیا 5 ستارہ ریویو!",
    body: "Bilal Raza: \"Excellent work! Very professional and on time. Highly recommended.\"",
    bodyUrdu: "بلال رضا: \"بہترین کام! بہت پروفیشنل اور وقت پر۔ سب کو سفارش کروں گا۔\"",
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    orderId: "29001",
  },
  {
    id: "n5",
    type: "message",
    title: "💬 New Message",
    titleUrdu: "💬 نیا پیغام",
    body: "Usman Khan: \"Can you come at 3 PM instead of 2 PM?\"",
    bodyUrdu: "عثمان خان: \"کیا آپ 2 بجے کی بجائے 3 بجے آ سکتے ہیں؟\"",
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(), // 6 hours ago
    orderId: "30002",
  },
  {
    id: "n6",
    type: "job-cancelled",
    title: "❌ Job Cancelled",
    titleUrdu: "❌ کام منسوخ",
    body: "Zainab Malik cancelled Light Fitting job. No cancellation fee applied.",
    bodyUrdu: "زینب ملک نے لائٹ فٹنگ جاب منسوخ کر دیا۔ کوئی کینسلیشن فیس نہیں لگی۔",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
    orderId: "29003",
  },
  {
    id: "n7",
    type: "system",
    title: "📢 Profile Boost Active",
    titleUrdu: "📢 پروفائل بوسٹ فعال",
    body: "Your profile is now featured in top search results for 24 hours.",
    bodyUrdu: "آپ کا پروفائل اب 24 گھنٹے کے لیے ٹاپ سرچ نتائج میں دکھایا جا رہا ہے۔",
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), // 2 days ago
  },
];

// ── Notifications for pending workers ──

const pendingWorkerNotifications: ProviderNotification[] = [
  {
    id: "n1",
    type: "system",
    title: "📋 Profile Submitted",
    titleUrdu: "📋 پروفائل جمع ہو گئی",
    body: "Your profile is under review. We'll notify you within 24-48 hours.",
    bodyUrdu: "آپ کی پروفائل زیرِ جائزہ ہے۔ ہم آپ کو 24-48 گھنٹوں میں مطلع کریں گے۔",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "n2",
    type: "system",
    title: "✅ Phone Verified",
    titleUrdu: "✅ فون تصدیق شدہ",
    body: "Your phone number has been verified successfully.",
    bodyUrdu: "آپ کا فون نمبر کامیابی سے تصدیق شدہ ہے۔",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
];

// ── Notifications for worker-3 (experienced, offline) ──

const experiencedWorkerNotifications: ProviderNotification[] = [
  {
    id: "n1",
    type: "new-job",
    title: "🆕 New Job Request!",
    titleUrdu: "🆕 نیا کام کی درخواست!",
    body: "Tariq Mehmood needs AC Repair in F-10 Markaz, Islamabad. Budget: Rs. 6,000",
    bodyUrdu: "طارق محمود کو F-10 مرکز اسلام آباد میں AC ریپیئر چاہیے۔ بجٹ: 6,000 روپے",
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    orderId: "40001",
  },
  {
    id: "n2",
    type: "new-job",
    title: "🆕 New Job Request!",
    titleUrdu: "🆕 نیا کام کی درخواست!",
    body: "Asad Malik needs AC Installation in G-9/1, Islamabad. 2 split units. Budget: Rs. 18,000",
    bodyUrdu: "اسد ملک کو G-9/1 اسلام آباد میں AC انسٹالیشن چاہیے۔ 2 سپلٹ یونٹس۔ بجٹ: 18,000 روپے",
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: "n3",
    type: "payment",
    title: "💰 Payment Received",
    titleUrdu: "💰 ادائیگی موصول",
    body: "Rs. 12,000 credited for AC Installation job by Dr. Aisha Siddiqui.",
    bodyUrdu: "ڈاکٹر عائشہ صدیقی کے AC انسٹالیشن جاب کی 12,000 روپے کی ادائیگی موصول ہوئی۔",
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    orderId: "39001",
  },
  {
    id: "n4",
    type: "review",
    title: "⭐ New 5-Star Review!",
    titleUrdu: "⭐ نیا 5 ستارہ ریویو!",
    body: "Dr. Aisha: \"Best AC technician in Islamabad. Very knowledgeable and honest.\"",
    bodyUrdu: "ڈاکٹر عائشہ: \"اسلام آباد کے بہترین AC ٹیکنیشن۔ بہت ماہر اور ایمانداد۔\"",
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    orderId: "39001",
  },
  {
    id: "n5",
    type: "system",
    title: "📊 Weekly Summary",
    titleUrdu: "📊 ہفتہ وار خلاصہ",
    body: "You completed 4 jobs this week earning Rs. 54,500. Great work!",
    bodyUrdu: "آپ نے اس ہفتے 4 جابز مکمل کیں اور 54,500 روپے کمائے۔ شاندار!",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "n6",
    type: "job-cancelled",
    title: "❌ Job Cancelled",
    titleUrdu: "❌ کام منسوخ",
    body: "Waqas Butt cancelled AC Deep Cleaning job in E-11/4.",
    bodyUrdu: "وقاص بٹ نے E-11/4 میں AC ڈیپ کلیننگ جاب منسوخ کر دیا۔",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    orderId: "39004",
  },
];

// ── Get notifications for the current worker ──

export function getNotifications(): ProviderNotification[] {
  const worker = getCurrentWorker();
  if (!worker) return approvedWorkerNotifications;

  switch (worker.id) {
    case "worker-1":
      return approvedWorkerNotifications;
    case "worker-2":
      return pendingWorkerNotifications;
    case "worker-3":
      return experiencedWorkerNotifications;
    default:
      return approvedWorkerNotifications;
  }
}
