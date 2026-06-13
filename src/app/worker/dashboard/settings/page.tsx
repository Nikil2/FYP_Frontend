"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { logout } from "@/lib/auth";
import { LanguageToggle } from "@/components/worker-dashboard/language-toggle";
import { OnlineToggle } from "@/components/worker-dashboard/online-toggle";
import { getCachedWorkerDashboardProfile } from "@/api/services/worker-dashboard";
import {
  Bell,
  Globe,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Moon,
  Smartphone,
  X,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

type ModalType = "help" | "terms" | "privacy" | null;

const DARK_MODE_KEY = "mehnati-dark-mode";
const NOTIFICATIONS_KEY = "mehnati-notifications";

const faqsEn = [
  {
    question: "How do I accept a booking request?",
    answer:
      "When a customer books your service, you'll receive a notification. Go to your Orders page, open the booking, and tap 'Accept' to confirm the job. You can also counter-propose a different price if needed.",
  },
  {
    question: "How does price negotiation work?",
    answer:
      "Customers can send a booking with their proposed budget. You can either accept it or send a counter-offer with your price. Once both parties agree, the booking moves to 'Accepted' status.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Earnings are credited to your Mehnati wallet after a job is marked 'Completed' and confirmed. Funds typically appear within 24 hours of job completion.",
  },
  {
    question: "How do I update my availability?",
    answer:
      "Use the Availability Status toggle on this page or the toggle on your Dashboard to go Online or Offline. Customers can only book you when you're online.",
  },
  {
    question: "How do I get verified?",
    answer:
      "Complete your profile with your CNIC, experience details, and at least one service. Our team reviews applications within 2–3 business days. You'll receive a notification once approved.",
  },
  {
    question: "How do I add portfolio photos?",
    answer:
      "Go to your Profile page and tap 'Work Photos'. Upload images of your completed jobs to showcase your skills and attract more customers.",
  },
  {
    question: "What if a customer cancels a booking?",
    answer:
      "If a customer cancels before the job starts, the booking is removed from your active orders. If they cancel mid-job, contact our support team — you may be eligible for a partial payment.",
  },
  {
    question: "How do I contact Mehnati support?",
    answer:
      "You can reach us via email at support@mehnati.pk, WhatsApp at +92-300-1234567, or through the in-app chat during business hours (Mon–Sat, 9AM–6PM PKT).",
  },
];

const faqsUr = [
  {
    question: "میں بکنگ کی درخواست کیسے قبول کروں؟",
    answer:
      "جب کوئی گاہک آپ کی سروس بک کرتا ہے، آپ کو نوٹیفکیشن ملے گی۔ اپنے آرڈرز صفحے پر جائیں، بکنگ کھولیں اور 'قبول کریں' پر ٹیپ کریں۔ اگر ضرورت ہو تو آپ مختلف قیمت بھی تجویز کر سکتے ہیں۔",
  },
  {
    question: "قیمت کا مذاکرہ کیسے کام کرتا ہے؟",
    answer:
      "گاہک اپنے تجویز کردہ بجٹ کے ساتھ بکنگ بھیج سکتے ہیں۔ آپ اسے قبول کر سکتے ہیں یا اپنی قیمت کے ساتھ جوابی پیشکش بھیج سکتے ہیں۔ دونوں فریقین کے متفق ہونے پر بکنگ 'منظور' کی حیثیت پر آ جاتی ہے۔",
  },
  {
    question: "مجھے ادائیگی کب ملے گی؟",
    answer:
      "کام مکمل اور تصدیق ہونے کے بعد آپ کی کمائی آپ کے مہناتی والیٹ میں جمع کر دی جاتی ہے۔ رقم عام طور پر کام مکمل ہونے کے 24 گھنٹوں کے اندر دستیاب ہو جاتی ہے۔",
  },
  {
    question: "میں اپنی دستیابی کیسے اپ ڈیٹ کروں؟",
    answer:
      "اس صفحے پر یا اپنے ڈیش بورڈ پر 'دستیابی کی حیثیت' کا بٹن استعمال کریں۔ گاہک صرف اس وقت آپ کو بک کر سکتے ہیں جب آپ آن لائن ہوں۔",
  },
  {
    question: "میں تصدیق کیسے حاصل کروں؟",
    answer:
      "اپنی پروفائل کو اپنے شناختی کارڈ، تجربے کی تفصیلات اور کم از کم ایک سروس کے ساتھ مکمل کریں۔ ہماری ٹیم 2–3 کاروباری دنوں میں درخواستوں کا جائزہ لیتی ہے۔ منظوری کے بعد آپ کو نوٹیفکیشن ملے گی۔",
  },
  {
    question: "میں پورٹ فولیو تصاویر کیسے شامل کروں؟",
    answer:
      "اپنے پروفائل صفحے پر جائیں اور 'کام کی تصاویر' پر ٹیپ کریں۔ اپنے مکمل کردہ کاموں کی تصاویر اپ لوڈ کریں تاکہ آپ کی مہارت ظاہر ہو اور زیادہ گاہک متوجہ ہوں۔",
  },
  {
    question: "اگر گاہک بکنگ منسوخ کر دے تو کیا ہوگا؟",
    answer:
      "اگر گاہک کام شروع ہونے سے پہلے منسوخ کرے تو بکنگ آپ کے فعال آرڈرز سے ہٹا دی جاتی ہے۔ اگر کام کے دوران منسوخ ہو تو ہماری سپورٹ ٹیم سے رابطہ کریں — آپ جزوی ادائیگی کے اہل ہو سکتے ہیں۔",
  },
  {
    question: "میں مہناتی سپورٹ سے کیسے رابطہ کروں؟",
    answer:
      "آپ ہم سے ای میل support@mehnati.pk پر، واٹس ایپ +92-300-1234567 پر، یا کاروباری اوقات (پیر–ہفتہ، صبح 9 بجے سے شام 6 بجے) کے دوران ان-ایپ چیٹ کے ذریعے رابطہ کر سکتے ہیں۔",
  },
];

export default function SettingsPage() {
  const { t, language } = useLanguage();
  const isUr = language === "ur";
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const cached = getCachedWorkerDashboardProfile();
    if (cached) setIsOnline(cached.isOnline);

    const savedDark = localStorage.getItem(DARK_MODE_KEY);
    if (savedDark === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const savedNotifs = localStorage.getItem(NOTIFICATIONS_KEY);
    if (savedNotifs === "false") setNotificationsEnabled(false);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(DARK_MODE_KEY, String(next));
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    localStorage.setItem(NOTIFICATIONS_KEY, String(next));
  };

  const faqs = isUr ? faqsUr : faqsEn;

  const closeModal = () => {
    setActiveModal(null);
    setExpandedFaq(null);
  };

  return (
    <div className={`space-y-6 p-4 lg:p-8 ${isUr ? "font-[inherit]" : ""}`} dir={isUr ? "rtl" : "ltr"}>
      <h1 className="text-2xl lg:text-3xl font-bold text-heading">
        {t.settings}
      </h1>

      {/* Preferences */}
      <div>
        <h3 className="text-base font-bold text-heading mb-3 px-1">
          {isUr ? "ترجیحات" : "Preferences"}
        </h3>
        <div className="space-y-1">
          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-tertiary" />
              <span className="font-medium text-heading">
                {isUr ? "پش نوٹیفکیشن" : "Push Notifications"}
              </span>
            </div>
            <button
              onClick={toggleNotifications}
              className={`relative w-11 h-6 rounded-full animation-standard flex-shrink-0 ${
                notificationsEnabled ? "bg-tertiary" : "bg-gray-300"
              }`}
              aria-label="Toggle notifications"
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md animation-standard ${
                  notificationsEnabled ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-tertiary" />
              <div>
                <span className="font-medium text-heading">
                  {isUr ? "ڈارک موڈ" : "Dark Mode"}
                </span>
                {darkMode && (
                  <p className="text-[10px] text-muted-foreground">
                    {isUr ? "فعال" : "Active"}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-11 h-6 rounded-full animation-standard flex-shrink-0 ${
                darkMode ? "bg-tertiary" : "bg-gray-300"
              }`}
              aria-label="Toggle dark mode"
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md animation-standard ${
                  darkMode ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-tertiary" />
              <span className="font-medium text-heading">
                {isUr ? "ایپ زبان" : "App Language"}
              </span>
            </div>
            <LanguageToggle />
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-tertiary" />
              <span className="font-medium text-heading">
                {isUr ? "دستیابی کی حیثیت" : "Availability Status"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-tertiary">
                {isOnline
                  ? isUr ? "آن لائن" : "Online"
                  : isUr ? "آف لائن" : "Offline"}
              </span>
              <OnlineToggle initialStatus={isOnline} showLabel={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-base font-bold text-heading mb-3 px-1">
          {isUr ? "سپورٹ" : "Support"}
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => setActiveModal("help")}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 animation-standard"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-tertiary" />
              <span className="font-medium text-heading">
                {isUr ? "مدد مرکز" : "Help Center"}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 text-muted-foreground ${isUr ? "rotate-180" : ""}`} />
          </button>

          <button
            onClick={() => setActiveModal("terms")}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 animation-standard"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-tertiary" />
              <span className="font-medium text-heading">
                {isUr ? "شرائط و ضوابط" : "Terms & Conditions"}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 text-muted-foreground ${isUr ? "rotate-180" : ""}`} />
          </button>

          <button
            onClick={() => setActiveModal("privacy")}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 animation-standard"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-tertiary" />
              <span className="font-medium text-heading">
                {isUr ? "رازداری کی پالیسی" : "Privacy Policy"}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 text-muted-foreground ${isUr ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Logout */}
      <Card className="p-0 overflow-hidden">
        <button
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 hover:bg-red-50 animation-standard font-medium"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          {isUr ? "لاگ آؤٹ" : "Logout"}
        </button>
      </Card>

      <div className="text-center text-xs text-muted-foreground pb-8">
        <p>Mehnati Marketplace v1.0.0</p>
        <p className="mt-1">© 2026 Mehnati. All rights reserved.</p>
      </div>

      {/* ── HELP CENTER MODAL ── */}
      {activeModal === "help" && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] flex flex-col rounded-t-2xl" dir={isUr ? "rtl" : "ltr"}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-tertiary" />
                <h3 className="text-base font-bold text-heading">
                  {isUr ? "مدد مرکز" : "Help Center"}
                </h3>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <p className="text-sm text-paragraph">
                {isUr
                  ? "مہناتی پر سروس ورکر کے طور پر کام کرنے سے متعلق عام سوالات کے جوابات یہاں ملیں گے۔"
                  : "Find answers to common questions about using Mehnati as a service worker."}
              </p>

              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className={`text-sm font-semibold text-heading ${isUr ? "pr-0 pl-3" : "pr-3"}`}>
                        {faq.question}
                      </span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-4 h-4 text-tertiary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4 text-sm text-paragraph border-t border-border pt-3 bg-muted/20">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-tertiary/10 rounded-xl p-4 space-y-3">
                <p className="text-sm font-bold text-heading">
                  {isUr ? "پھر بھی مدد چاہیے؟" : "Still need help?"}
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:support@mehnati.pk"
                    className="flex items-center gap-3 text-sm text-paragraph hover:text-tertiary transition-colors"
                  >
                    <Mail className="w-4 h-4 text-tertiary flex-shrink-0" />
                    support@mehnati.pk
                  </a>
                  <a
                    href="tel:+923001234567"
                    className="flex items-center gap-3 text-sm text-paragraph hover:text-tertiary transition-colors"
                  >
                    <Phone className="w-4 h-4 text-tertiary flex-shrink-0" />
                    +92-300-1234567
                  </a>
                  <div className="flex items-center gap-3 text-sm text-paragraph">
                    <MessageCircle className="w-4 h-4 text-tertiary flex-shrink-0" />
                    {isUr
                      ? "واٹس ایپ: پیر–ہفتہ، صبح 9 بجے سے شام 6 بجے (پاکستانی وقت)"
                      : "WhatsApp: Mon–Sat, 9AM–6PM PKT"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TERMS & CONDITIONS MODAL ── */}
      {activeModal === "terms" && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] flex flex-col rounded-t-2xl" dir={isUr ? "rtl" : "ltr"}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-tertiary" />
                <h3 className="text-base font-bold text-heading">
                  {isUr ? "شرائط و ضوابط" : "Terms & Conditions"}
                </h3>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm text-paragraph">
              <p className="text-xs text-muted-foreground">
                {isUr ? "آخری تازہ کاری: یکم جنوری 2026" : "Last updated: January 1, 2026"}
              </p>

              {isUr ? (
                <>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۱۔ شرائط کی قبولیت</h4>
                    <p>مہناتی مارکیٹ پلیس پر سروس ورکر کے طور پر رجسٹر ہو کر آپ ان شرائط و ضوابط کو قبول کرتے ہیں۔ اگر آپ متفق نہیں تو آپ اس پلیٹ فارم کو استعمال نہیں کر سکتے۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۲۔ ورکر کی اہلیت</h4>
                    <p>ورکر کے طور پر رجسٹر ہونے کے لیے آپ کو چاہیے کہ: (الف) آپ کی عمر کم از کم 18 سال ہو؛ (ب) آپ کے پاس درست پاکستانی شناختی کارڈ ہو؛ (ج) آپ کے پاس درج کردہ خدمات کی مہارت اور اہلیت ہو؛ اور (د) آپ تمام متعلقہ پاکستانی قوانین و ضوابط کی پابندی کریں۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۳۔ تصدیق کا عمل</h4>
                    <p>مہناتی کو آپ کی پروفائل منظور کرنے سے پہلے آپ کی شناخت اور پیشہ ورانہ اسناد کی تصدیق کا حق حاصل ہے۔ غلط معلومات فراہم کرنا فوری اکاؤنٹ ختم کرنے اور قانونی کارروائی کا سبب بن سکتا ہے۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۴۔ خدمات کے معیارات</h4>
                    <p>آپ اس بات پر متفق ہیں کہ: خدمات پیشہ ورانہ انداز میں فراہم کریں گے؛ وقت پر پہنچیں گے؛ گاہکوں سے فوری رابطہ رکھیں گے؛ اور ہراسانی، امتیازی سلوک یا دھوکہ دہی سے اجتناب کریں گے۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۵۔ ادائیگیاں اور کمیشن</h4>
                    <p>مہناتی ہر مکمل بکنگ پر ایک پلیٹ فارم سروس فیس وصول کرتا ہے۔ موجودہ فیس کا ڈھانچہ آپ کے والیٹ ڈیش بورڈ پر دیکھا جا سکتا ہے۔ کام مکمل ہونے کی تصدیق کے 24 گھنٹوں کے اندر رقم آپ کے مہناتی والیٹ میں منتقل ہو جاتی ہے۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۶۔ منسوخیاں</h4>
                    <p>بغیر معقول وجہ کے بار بار منسوخی یا غیر حاضری اکاؤنٹ معطل کرنے کا سبب بن سکتی ہے۔ ورکرز کو صرف وہ کام قبول کرنے کی ترغیب دی جاتی ہے جو وہ قابل اعتماد طریقے سے مکمل کر سکتے ہوں۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۷۔ تنازعات کا حل</h4>
                    <p>ورکر اور گاہک کے درمیان کسی بھی تنازع کی صورت میں مہناتی ایک غیر جانب دار ثالث کے طور پر کام کرے گا۔ تنازعات میں پلیٹ فارم کا فیصلہ حتمی اور تمام فریقین کے لیے لازمی ہوگا۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۸۔ اکاؤنٹ کی برطرفی</h4>
                    <p>مہناتی کو کسی بھی ورکر کا اکاؤنٹ معطل یا ختم کرنے کا حق حاصل ہے جو ان شرائط کی خلاف ورزی کرے، بار بار منفی رائے حاصل کرے، یا گاہکوں یا پلیٹ فارم کو نقصان پہنچانے والی سرگرمیوں میں ملوث ہو۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۹۔ ترامیم</h4>
                    <p>یہ شرائط وقتاً فوقتاً اپ ڈیٹ کی جا سکتی ہیں۔ تبدیلیوں کے بعد پلیٹ فارم کا مسلسل استعمال نئی شرائط کی قبولیت سمجھا جائے گا۔ اہم تبدیلیوں کی اطلاع ان-ایپ نوٹیفکیشن کے ذریعے دی جائے گی۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۱۰۔ رابطہ</h4>
                    <p>ان شرائط سے متعلق سوالات کے لیے ہم سے{" "}
                      <a href="mailto:legal@mehnati.pk" className="text-tertiary underline">legal@mehnati.pk</a>
                      {" "}پر رابطہ کریں۔</p>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">1. Acceptance of Terms</h4>
                    <p>By registering as a service worker on Mehnati Marketplace, you agree to be bound by these Terms & Conditions. If you do not agree, you may not use the platform.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">2. Worker Eligibility</h4>
                    <p>To register as a worker you must: (a) be at least 18 years of age; (b) hold a valid Pakistani CNIC; (c) have the skills and qualifications required for your listed services; and (d) comply with all applicable Pakistani laws and regulations.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">3. Verification Process</h4>
                    <p>Mehnati reserves the right to verify your identity and professional credentials before approving your profile. Providing false information is grounds for immediate account termination and may result in legal action.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">4. Service Standards</h4>
                    <p>You agree to: provide services in a professional and workmanlike manner; arrive on time for scheduled jobs; communicate promptly with customers; and not engage in any form of harassment, discrimination, or fraud.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">5. Payments & Commission</h4>
                    <p>Mehnati charges a platform service fee on each completed booking. The current fee structure is displayed in your wallet dashboard. Payment is released to your Mehnati wallet within 24 hours of job completion confirmation.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">6. Cancellations</h4>
                    <p>Repeated cancellations or no-shows without valid reason may result in account suspension. Workers are encouraged to only accept jobs they can reliably complete.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">7. Dispute Resolution</h4>
                    <p>In the event of a dispute between a worker and customer, Mehnati will act as a neutral mediator. The platform&apos;s decision in disputes shall be final and binding on all parties.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">8. Account Termination</h4>
                    <p>Mehnati reserves the right to suspend or terminate any worker account that violates these terms, receives repeated negative feedback, or engages in activities harmful to customers or the platform.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">9. Modifications</h4>
                    <p>These terms may be updated from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms. We will notify you of significant changes via in-app notification.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">10. Contact</h4>
                    <p>For questions regarding these terms, contact us at{" "}
                      <a href="mailto:legal@mehnati.pk" className="text-tertiary underline">legal@mehnati.pk</a>.
                    </p>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PRIVACY POLICY MODAL ── */}
      {activeModal === "privacy" && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] flex flex-col rounded-t-2xl" dir={isUr ? "rtl" : "ltr"}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-tertiary" />
                <h3 className="text-base font-bold text-heading">
                  {isUr ? "رازداری کی پالیسی" : "Privacy Policy"}
                </h3>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm text-paragraph">
              <p className="text-xs text-muted-foreground">
                {isUr ? "آخری تازہ کاری: یکم جنوری 2026" : "Last updated: January 1, 2026"}
              </p>

              {isUr ? (
                <>
                  <p>مہناتی مارکیٹ پلیس آپ کی ذاتی معلومات کی حفاظت کے لیے پرعزم ہے۔ یہ پالیسی بیان کرتی ہے کہ ہم آپ کا ڈیٹا کیسے جمع کرتے، استعمال کرتے اور محفوظ رکھتے ہیں۔</p>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۱۔ ہم کیا معلومات جمع کرتے ہیں</h4>
                    <ul className="list-disc pr-5 space-y-1">
                      <li><strong>شناختی ڈیٹا:</strong> پورا نام، شناختی کارڈ نمبر، پروفائل تصویر</li>
                      <li><strong>رابطہ ڈیٹا:</strong> فون نمبر، شہر/مقام</li>
                      <li><strong>پیشہ ورانہ ڈیٹا:</strong> مہارتیں، تجربہ، پورٹ فولیو تصاویر، پیش کردہ خدمات</li>
                      <li><strong>لین دین کا ڈیٹا:</strong> بکنگز، ادائیگیاں، کمائی کی تاریخ</li>
                      <li><strong>استعمال کا ڈیٹا:</strong> ایپ سرگرمی، لاگ ان اوقات، آلے کی معلومات</li>
                    </ul>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۲۔ ہم آپ کا ڈیٹا کیسے استعمال کرتے ہیں</h4>
                    <p>ہم آپ کی معلومات درج ذیل مقاصد کے لیے استعمال کرتے ہیں:</p>
                    <ul className="list-disc pr-5 space-y-1">
                      <li>آپ کا ورکر اکاؤنٹ بنانا اور منظم کرنا</li>
                      <li>آپ کی شناخت اور پیشہ ورانہ اسناد کی تصدیق</li>
                      <li>گاہکوں کی متعلقہ سروس درخواستوں سے آپ کا میل کرانا</li>
                      <li>ادائیگیاں کارروائی کرنا اور کمائی کے ریکارڈ رکھنا</li>
                      <li>بکنگ نوٹیفکیشنز اور پلیٹ فارم اپ ڈیٹس بھیجنا</li>
                      <li>پلیٹ فارم کی حفاظت اور صارف تجربے کو بہتر بنانا</li>
                    </ul>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۳۔ ڈیٹا شیئرنگ</h4>
                    <p>ہم آپ کا نام، پروفائل تصویر، ریٹنگ اور سروس معلومات ان گاہکوں کے ساتھ شیئر کرتے ہیں جو آپ کی پروفائل دیکھتے ہیں۔ ہم آپ کا ذاتی ڈیٹا تیسرے فریق کو فروخت نہیں کرتے۔ ہم سخت رازداری کے معاہدوں کے تحت قابل اعتماد سروس فراہم کنندگان کے ساتھ ڈیٹا شیئر کر سکتے ہیں۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۴۔ ڈیٹا کی حفاظت</h4>
                    <p>ہم آپ کے ڈیٹا کی حفاظت کے لیے صنعتی معیار کی خفیہ کاری (TLS/HTTPS) اور محفوظ کلاؤڈ انفراسٹرکچر استعمال کرتے ہیں۔ پاس ورڈز ہیش کیے جاتے ہیں اور کبھی سادہ متن میں محفوظ نہیں ہوتے۔ تاہم براہ کرم اپنی لاگ ان معلومات خفیہ رکھیں۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۵۔ آپ کے حقوق</h4>
                    <p>آپ کو حق حاصل ہے کہ:</p>
                    <ul className="list-disc pr-5 space-y-1">
                      <li>اپنی پروفائل صفحے کے ذریعے ذاتی معلومات تک رسائی اور تازہ کاری کریں</li>
                      <li>اپنا اکاؤنٹ اور متعلقہ ڈیٹا حذف کرنے کی درخواست کریں</li>
                      <li>غیر ضروری مواصلات سے آپٹ آؤٹ کریں</li>
                      <li>سپورٹ سے رابطہ کر کے اپنے ڈیٹا کی کاپی طلب کریں</li>
                    </ul>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۶۔ ڈیٹا کی مدت</h4>
                    <p>ہم آپ کا اکاؤنٹ ڈیٹا اس وقت تک رکھتے ہیں جب تک آپ کا اکاؤنٹ فعال ہو۔ لین دین کے ریکارڈز قانونی اور مالی تقاضوں کے لیے 5 سال تک محفوظ رکھے جا سکتے ہیں۔</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">۷۔ ہم سے رابطہ کریں</h4>
                    <p>رازداری سے متعلق سوالات یا ڈیٹا کی درخواستوں کے لیے ہمارے ڈیٹا پروٹیکشن آفیسر سے{" "}
                      <a href="mailto:privacy@mehnati.pk" className="text-tertiary underline">privacy@mehnati.pk</a>
                      {" "}پر رابطہ کریں۔</p>
                  </section>
                </>
              ) : (
                <>
                  <p>Mehnati Marketplace (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.</p>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">1. Information We Collect</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Identity data:</strong> Full name, CNIC number, profile photo</li>
                      <li><strong>Contact data:</strong> Phone number, city/location</li>
                      <li><strong>Professional data:</strong> Skills, experience, portfolio photos, services offered</li>
                      <li><strong>Transaction data:</strong> Bookings, payments, earnings history</li>
                      <li><strong>Usage data:</strong> App activity, login times, device information</li>
                    </ul>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">2. How We Use Your Data</h4>
                    <p>We use your information to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Create and manage your worker account</li>
                      <li>Verify your identity and professional credentials</li>
                      <li>Match you with relevant service requests from customers</li>
                      <li>Process payments and maintain earnings records</li>
                      <li>Send booking notifications and platform updates</li>
                      <li>Improve platform safety and user experience</li>
                    </ul>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">3. Data Sharing</h4>
                    <p>We share your name, profile photo, rating, and service information with customers who view your profile. We do not sell your personal data to third parties. We may share data with trusted service providers (payment processors, cloud hosting) under strict confidentiality agreements.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">4. Data Security</h4>
                    <p>We use industry-standard encryption (TLS/HTTPS) and secure cloud infrastructure to protect your data. Passwords are hashed and never stored in plain text. However, no system is completely secure — please keep your login credentials confidential.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">5. Your Rights</h4>
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Access and update your personal information via your Profile page</li>
                      <li>Request deletion of your account and associated data</li>
                      <li>Opt out of non-essential communications</li>
                      <li>Request a copy of your data by contacting support</li>
                    </ul>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">6. Data Retention</h4>
                    <p>We retain your account data for as long as your account is active. Transaction records may be retained for up to 5 years for legal and financial compliance purposes.</p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-heading">7. Contact Us</h4>
                    <p>For privacy-related questions or data requests, contact our Data Protection Officer at{" "}
                      <a href="mailto:privacy@mehnati.pk" className="text-tertiary underline">privacy@mehnati.pk</a>.
                    </p>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
