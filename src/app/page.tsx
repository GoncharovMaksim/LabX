"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  Send, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Brain, 
  FileText, 
  Check, 
  Copy, 
  Terminal, 
  User, 
  Code2, 
  Layers, 
  Briefcase, 
  Clock, 
  ExternalLink, 
  Zap, 
  RotateCcw,
  Lock
} from "lucide-react";

// Custom Github Icon to avoid Lucide-React brand icon deprecation issues
const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Types
interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface AnalysisResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  coverLetter: string;
  simulated: boolean;
  warning?: string;
}

export default function PortfolioHome() {
  // Navigation State
  const [activeSection, setActiveSection] = useState("hero");

  // Contact Form State
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", comment: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [emailLogs, setEmailLogs] = useState<any | null>(null);
  const [showEmailLogs, setShowEmailLogs] = useState(false);

  // Experience Tab State
  const [activeExpTab, setActiveExpTab] = useState("rzd");

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Привет! Я ИИ-ассистент Максима. Могу рассказать о его опыте, стеке технологий, интересных кейсах в РЖД или готовности к новым задачам. Спросите меня о чём-нибудь или выберите готовый вопрос ниже!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // AI Assistant Job Analyzer State
  const [jobDescription, setJobDescription] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  // Scroll Spy for Navbar highlight
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "work", "cases", "ai-recruiter", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // Handle Contact Form Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess(false);
    setFormError(null);
    setValidationErrors({});
    setEmailLogs(null);

    // Frontend Field Validation
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Пожалуйста, введите ваше имя";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Имя должно содержать не менее 2 символов";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Пожалуйста, введите номер телефона";
    } else if (formData.phone.trim().length < 5) {
      errors.phone = "Некорректный формат телефона";
    }

    if (!formData.email.trim()) {
      errors.email = "Пожалуйста, введите ваш email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Введите корректный email (например, name@domain.com)";
      }
    }

    if (!formData.comment.trim()) {
      errors.comment = "Пожалуйста, введите ваше сообщение";
    } else if (formData.comment.trim().length < 10) {
      errors.comment = "Сообщение должно содержать не менее 10 символов";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setFormError("Пожалуйста, заполните обязательные поля корректно.");
      setFormLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Что-то пошло не так при отправке формы.");
      }

      setFormSuccess(true);
      setFormData({ name: "", phone: "", email: "", comment: "" });
      setValidationErrors({});
      
      // Save debug simulation data if SMTP was not configured
      if (data.simulated && data.debugData) {
        setEmailLogs(data.debugData);
      }
    } catch (err: any) {
      setFormError(err.message || "Ошибка соединения с сервером.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Send Chat Message
  const handleSendChatMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "chat", query: textToSend }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка ИИ-сервиса.");
      }

      const aiMsg: ChatMessage = {
        sender: "ai",
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        sender: "ai",
        text: `⚠️ Ошибка: ${err.message || "Не удалось связаться с ИИ. Пожалуйста, попробуйте позже."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Preset Questions
  const presetQuestions = [
    "Какой опыт у Максима в Next.js?",
    "Расскажи про проекты в РЖД-Технологии",
    "Как Максим использует AI в разработке?",
    "Готов ли к переезду и командировкам?"
  ];

  // Handle Job Description Analysis
  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim()) return;

    setAnalysisLoading(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    setCopiedCoverLetter(false);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "analyze", jobDescription }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка анализа вакансии.");
      }

      setAnalysisResult(data);
    } catch (err: any) {
      setAnalysisError(err.message || "Не удалось завершить анализ.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Preset Job Descriptions for quick testing
  const presetJDs = [
    {
      title: "Senior Fullstack Developer (Next.js / Node.js)",
      text: "Ищем опытного Fullstack разработчика. Обязателен опыт работы с React, Next.js, TypeScript. Разработка серверной части на Node.js (Express), работа с REST API и базами данных. Будет плюсом опыт настройки CI/CD пайплайнов в GitHub Actions, покрытие кода тестами (Jest/RTL), использование Docker. Ожидаем высокие показатели Core Web Vitals и оптимизации LCP."
    },
    {
      title: "Frontend Engineer (React / SASS / Tailwind)",
      text: "Требуется сильный Frontend-разработчик в команду разработки интерфейсов. Стек: React, TypeScript, Tailwind CSS, SASS. Адаптивная и кроссбраузерная Pixel-Perfect верстка, оптимизация производительности интерфейса, внедрение лучших практик UI/UX. Работа в Agile команде."
    }
  ];

  const handleCopyCoverLetter = () => {
    if (analysisResult?.coverLetter) {
      navigator.clipboard.writeText(analysisResult.coverLetter);
      setCopiedCoverLetter(true);
      setTimeout(() => setCopiedCoverLetter(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-950/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: "-3s" }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-violet-900/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: "-6s" }}></div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-all">
              MG
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent group-hover:to-white transition-all">
              Гончаров Максим
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: "hero", label: "Главная" },
              { id: "about", label: "Обо мне" },
              { id: "work", label: "Как я работаю" },
              { id: "cases", label: "Проекты" },
              { id: "ai-recruiter", label: "ИИ-Помощник" },
              { id: "contact", label: "Контакты" }
            ].map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeSection === tab.id 
                    ? "bg-zinc-800 text-indigo-400 shadow-sm" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>

          {/* Quick CTA */}
          <div className="flex items-center gap-2">
            <a 
              href="#ai-recruiter" 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 hover:text-indigo-200 transition-all hover:bg-indigo-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ИИ-Ассистент
            </a>
            <a 
              href="#contact" 
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-md active:scale-95"
            >
              Связаться
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-20 pb-24 md:py-32 glow-grid border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900/80 border border-zinc-800 text-indigo-400 select-none animate-float">
                <Sparkles className="w-3 h-3 text-indigo-500 glow-dot-indigo" />
                <span>Fullstack-разработчик готовый к деплою</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
                  Гончаров Максим
                  <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                    React / Next.js / Node.js
                  </span>
                </h1>
                
                <p className="max-w-xl mx-auto lg:mx-0 text-zinc-400 text-lg leading-relaxed">
                  Разработчик с опытом более 4 лет в создании высокопроизводительных веб-приложений. 
                  Специализируюсь на Server Components, SSR/SSG/ISR, оптимизации производительности Core Web Vitals и интеграции AI решений.
                </p>
              </div>

              {/* Skills Tags Quick Row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 max-w-lg">
                {["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS", "Docker", "CI/CD"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-900 text-zinc-300 border border-zinc-800/60">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a 
                  href="#ai-recruiter" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                  <Brain className="w-4 h-4" />
                  Проверить в ИИ-Рекрутере
                </a>
                <a 
                  href="#contact" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all text-zinc-300 hover:text-white"
                >
                  Написать напрямую
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Photo Avatar Card (Premium Glassmorphism) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group select-none">
                
                {/* Glowing Aura backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-2xl blur-[12px] opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative glass-panel rounded-2xl p-4 w-[310px] sm:w-[360px] flex flex-col items-center">
                  
                  {/* Photo container with floating layout */}
                  <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 mb-4">
                    <Image
                      src="/avatar.jpg"
                      alt="Гончаров Максим"
                      fill
                      priority
                      sizes="(max-width: 768px) 300px, 350px"
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse glow-dot-emerald"></span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Открыт к предложениям</span>
                    </div>
                  </div>

                  {/* Name and Stack */}
                  <div className="text-center w-full">
                    <h3 className="text-xl font-bold text-white tracking-tight">Гончаров Максим</h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">maksimgoncharov112@gmail.com</p>
                    
                    {/* Glowing stats summary inside card */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-900/60 w-full text-center">
                      <div className="p-1">
                        <div className="text-lg font-bold text-indigo-400">4+</div>
                        <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">Года опыта</div>
                      </div>
                      <div className="p-1 border-x border-zinc-900">
                        <div className="text-lg font-bold text-emerald-400">100/100</div>
                        <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">PageSpeed</div>
                      </div>
                      <div className="p-1">
                        <div className="text-lg font-bold text-purple-400">-25%</div>
                        <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">LCP (РЖД)</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS & HIGHLIGHTS */}
      <section className="bg-zinc-950/80 py-12 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "4 года 5 мес", label: "Профессиональный опыт" },
              { value: "25% снижение LCP", label: "Оптимизация в РЖД" },
              { value: "100 / 100", label: "Google PageSpeed баллов" },
              { value: "C1 Advanced", label: "Свободный английский" }
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-5 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT & EXPERIENCE SECTION */}
      <section id="about" className="py-24 border-b border-zinc-900 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Информация о себе</h2>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Квалификация и опыт работы</p>
            <div className="w-12 h-1 bg-indigo-500 mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Stack and Directions (Left) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-6 rounded-2xl space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  Ключевые направления
                </h3>
                
                <div className="space-y-4 text-sm text-zinc-300">
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all">
                    <div className="font-bold text-white">Fullstack разработка</div>
                    <p className="text-xs text-zinc-400 mt-1">Проектирование и создание веб-сервисов с нуля. Связка React/Next.js на клиенте и Node.js/REST API на сервере.</p>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all">
                    <div className="font-bold text-white">Оптимизация производительности (Performance first)</div>
                    <p className="text-xs text-zinc-400 mt-1">Опыт ускорения Core Web Vitals, уменьшения TTI/LCP, грамотная настройка сборщиков Webpack/Vite и SSR/SSG/ISR архитектур.</p>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all">
                    <div className="font-bold text-white">CI/CD и Автоматизация</div>
                    <p className="text-xs text-zinc-400 mt-1">Сборка Docker контейнеров, развертывание проектов и написание GitHub Actions пайплайнов для автоматического тестирования (Jest/RTL) и деплоя.</p>
                  </div>
                </div>
              </div>

              {/* Detailed Skills Grid */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Полный стек навыков
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-zinc-400 font-mono mb-1.5">Languages & Frameworks:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {["JavaScript", "TypeScript", "React", "Next.js", "Express.js", "Node.js"].map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800/80 rounded text-[11px] text-indigo-300 font-mono">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-mono mb-1.5">State & Styles:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Redux Toolkit", "Zustand", "React Query", "Tailwind CSS", "SASS/SCSS", "CSS Modules"].map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800/80 rounded text-[11px] text-zinc-300 font-mono">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-mono mb-1.5">Infrastructure & DevTools:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Docker", "CI/CD", "GitHub Actions", "MongoDB", "REST API", "Jest", "RTL", "Webpack", "Vite"].map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800/80 rounded text-[11px] text-emerald-300 font-mono">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience Timeline (Right) */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between">
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      Опыт работы
                    </h3>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => setActiveExpTab("rzd")}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                          activeExpTab === "rzd" 
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" 
                            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        РЖД-Технологии
                      </button>
                      <button 
                        onClick={() => setActiveExpTab("simpleup")}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                          activeExpTab === "simpleup" 
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" 
                            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Simple-Up
                      </button>
                    </div>
                  </div>

                  {activeExpTab === "rzd" ? (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-lg font-bold text-white">Fullstack-разработчик</h4>
                          <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-semibold">
                            Май 2022 — Настоящее время (4 года 1 мес)
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 font-semibold mt-1">ООО «РЖД-Технологии» • Москва (Удаленно)</div>
                      </div>

                      <ul className="space-y-2.5 text-sm text-zinc-300 list-disc list-inside pl-1">
                        <li>
                          <strong className="text-white">Оптимизация Core Web Vitals:</strong> Снизил показатель LCP (Largest Contentful Paint) на 25% через внедрение динамических импортов и глубокую оптимизацию ассетов в Next.js.
                        </li>
                        <li>
                          <strong className="text-white">Визуализация реального времени:</strong> Спроектировал и реализовал комплексные дашборды визуализации логистических цепочек с использованием WebSockets.
                        </li>
                        <li>
                          <strong className="text-white">Внутренняя библиотека UI-компонентов:</strong> Создал и поддерживал дизайн-систему (Tailwind CSS, Radix UI), что ускорило прототипирование и вывод новых сервисов на рынок на 30%.
                        </li>
                        <li>
                          <strong className="text-white">Архитектурные решения:</strong> Перевел ключевые панели управления на гибридную модель SSR/SSG, добившись мгновенного отклика интерфейса.
                        </li>
                        <li>
                          <strong className="text-white">Инфраструктура:</strong> Настроил автоматизированные CI/CD пайплайны на основе GitHub Actions, стабилизировав релизы и защитив прод тестами (Jest/RTL).
                        </li>
                      </ul>

                      <div className="pt-2">
                        <div className="text-xs text-zinc-400 font-semibold mb-1">Используемый стек:</div>
                        <div className="flex flex-wrap gap-1">
                          {["React", "Next.js", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Node.js", "REST API", "Jest", "GitHub Actions", "Docker", "Agile"].map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800/80 rounded text-[10px] text-zinc-400 font-mono">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-lg font-bold text-white">Frontend-разработчик</h4>
                          <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-semibold">
                            Январь 2022 — Май 2022 (5 месяцев)
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 font-semibold mt-1">Веб студия «Simple-Up» • Ростов-на-Дону</div>
                      </div>

                      <ul className="space-y-2.5 text-sm text-zinc-300 list-disc list-inside pl-1">
                        <li>
                          <strong className="text-white">Проекты с нуля:</strong> Успешно реализовал 3+ коммерческих проекта «под ключ», добившись 100/100 баллов в аудитах Google PageSpeed.
                        </li>
                        <li>
                          <strong className="text-white">Рефакторинг и SOLID:</strong> Провел комплексный рефакторинг legacy-кода на стек React + TypeScript с соблюдением принципов SOLID и DRY, упростив поддержку кодовой базы.
                        </li>
                        <li>
                          <strong className="text-white">SEO & Валидный макет:</strong> Обеспечил строгую Pixel Perfect верстку и высокую поисковую доступность сайтов через семантическую структуру HTML5 и SASS/SCSS.
                        </li>
                        <li>
                          <strong className="text-white">Оптимизация сборки:</strong> Перенастроил конфигурации Webpack/Babel, сократив размер финального бандла и существенно уменьшив показатель TTI (Time to Interactive).
                        </li>
                      </ul>

                      <div className="pt-2">
                        <div className="text-xs text-zinc-400 font-semibold mb-1">Используемый стек:</div>
                        <div className="flex flex-wrap gap-1">
                          {["React.js", "Next.js", "TypeScript", "SASS/SCSS", "Webpack", "Core Web Vitals", "SEO Optimization"].map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800/80 rounded text-[10px] text-zinc-400 font-mono">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Education section */}
                <div className="border-t border-zinc-900 mt-6 pt-4 space-y-2">
                  <div className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    Высшее Образование & Сертификаты
                  </div>
                  <div className="flex flex-wrap justify-between text-xs gap-2">
                    <div>
                      <span className="font-bold text-zinc-300">Омский государственный университет путей сообщения</span>
                      <p className="text-zinc-500 font-medium mt-0.5">Специализация: Системы передачи и распределения информации (2011)</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-indigo-400 border border-zinc-800 font-semibold text-[10px] tracking-wider">
                        2011 • ИНЖЕНЕР
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* HOW I WORK & AI TOOLS */}
      <section id="work" className="py-24 border-b border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Процессы разработки</h2>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Как я подхожу к задачам</p>
            <div className="w-12 h-1 bg-indigo-500 mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Approach 1 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500"></div>
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 font-bold text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Инженерный подход</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Высшее техническое образование сформировало системное мышление. Решаю задачи через глубокий анализ требований, а не метод «тыка». 
                Строго придерживаюсь принципов <strong className="text-zinc-300">SOLID, DRY, KISS</strong>. Всегда пишу чистый и расширяемый код.
              </p>
            </div>

            {/* Approach 2 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-purple-500"></div>
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 font-bold text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Фокус на производительности</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Пользователь не должен ждать. Постоянно оптимизирую размер бандла, контролирую Core Web Vitals, 
                проектирую правильные стратегии рендеринга (SSR для динамики, SSG/ISR для быстроты, ленивые импорты). Результат — высокие баллы PageSpeed.
              </p>
            </div>

            {/* Approach 3 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500"></div>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 font-bold text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-3">AI-Сопроцессор в деле</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Уверенно интегрирую ИИ в повседневную разработку. Позволяет избавиться от рутины, быстрее писать тесты, 
                быстрее генерировать скелетоны интерфейса. Выступаю в роли архитектора и рецензента кода, контролируя качество.
              </p>
            </div>

          </div>

          {/* AI Tools breakdown (WOW component) */}
          <div className="mt-12 glass-panel p-8 rounded-2xl border border-indigo-500/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-4 space-y-4">
                <div className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded text-xs font-semibold">
                  <Brain className="w-3.5 h-3.5" />
                  AI Synergy
                </div>
                <h3 className="text-2xl font-bold text-white">Как ИИ ускоряет мою разработку</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Использование искусственного интеллекта — это не замена разработчика, а многократное умножение его эффективности. Вот как я интегрирую ИИ:
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Генерация юнит-тестов", desc: "Скармливаю ИИ сигнатуру функции для написания Jest/RTL тестов. Экономит до 70% времени на рутину." },
                  { title: "Архитектурный брейншторм", desc: "Консультируюсь по поводу структуры сложных типов TS или построения масштабируемых стейт-менеджеров." },
                  { title: "Cursor & AI IDE", desc: "Использую современные умные среды разработки для быстрого рефакторинга больших кусков legacy-кода." },
                  { title: "Анализ документации", desc: "Быстро вычленяю ключевые части из новых, длинных API-спецификаций или библиотек." }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div className="text-sm font-bold text-white">{item.title}</div>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CASE STUDIES / PROJECTS */}
      <section id="cases" className="py-24 border-b border-zinc-900 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Портфолио проектов</h2>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Реальные и учебные кейсы</p>
            <div className="w-12 h-1 bg-indigo-500 mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Case 1 */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-900 hover:border-zinc-800/80 transition-all flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs font-semibold text-indigo-300 font-mono">Коммерческий</span>
                  <span className="text-xs text-zinc-500 font-mono">ООО «РЖД-Технологии»</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">Система мониторинга логистических цепочек в реальном времени</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Проектирование и разработка интерактивных дашбордов для диспетчеров РЖД. Мониторинг движения составов, выгрузка аналитики и отображение инцидентов.
                </p>
                
                <div className="space-y-2 pt-2">
                  <div className="text-xs text-zinc-400 font-semibold">Моя личная роль в проекте:</div>
                  <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside pl-1">
                    <li>Разработал веб-сокет модуль для динамического обновления данных без перезагрузки.</li>
                    <li>Оптимизировал рендеринг карты с 2000+ маркерами (Leaflet.js).</li>
                    <li>Снизил LCP на 25%, внедрив постраничную ленивую сборку.</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-6 bg-zinc-900/30 border-t border-zinc-900/60 flex flex-wrap gap-1.5">
                {["Next.js", "React", "TypeScript", "Redux Toolkit", "WebSockets", "Tailwind CSS", "Jest"].map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-zinc-950 text-zinc-400 rounded text-[10px] font-mono border border-zinc-900">{t}</span>
                ))}
              </div>
            </div>

            {/* Case 2 */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-900 hover:border-zinc-800/80 transition-all flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs font-semibold text-indigo-300 font-mono">Коммерческий</span>
                  <span className="text-xs text-zinc-500 font-mono">Веб студия «Simple-Up»</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">Пакет промо-сайтов для крупной инвестиционной компании</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Разработка 3+ коммерческих высоконагруженных лендингов с упором на визуальную безупречность (Pixel Perfect) и максимальную скорость загрузки для SEO-продвижения.
                </p>
                
                <div className="space-y-2 pt-2">
                  <div className="text-xs text-zinc-400 font-semibold">Моя личная роль в проекте:</div>
                  <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside pl-1">
                    <li>Добился 100/100 баллов в Google PageSpeed во всех аудитах за счет сжатия ассетов.</li>
                    <li>Интегрировал сложные микро-анимации на чистом CSS/SCSS (без тяжелых библиотек).</li>
                    <li>Оптимизировал конфиги Webpack/Babel, сократив размер бандла в 2.1 раза.</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-6 bg-zinc-900/30 border-t border-zinc-900/60 flex flex-wrap gap-1.5">
                {["React.js", "Next.js", "TypeScript", "SASS/SCSS", "Webpack", "Google PageSpeed", "BEM"].map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-zinc-950 text-zinc-400 rounded text-[10px] font-mono border border-zinc-900">{t}</span>
                ))}
              </div>
            </div>

            {/* Case 3 */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-900 hover:border-zinc-800/80 transition-all flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs font-semibold text-emerald-300 font-mono">Внутренний продукт</span>
                  <span className="text-xs text-zinc-500 font-mono">ООО «РЖД-Технологии»</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">Библиотека UI-компонентов корпоративного сегмента</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Создание единой, типизированной базы UI-компонентов с поддержкой тем оформления (включая темную), соответствующей требованиям доступности WAI-ARIA.
                </p>
                
                <div className="space-y-2 pt-2">
                  <div className="text-xs text-zinc-400 font-semibold">Моя личная роль в проекте:</div>
                  <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside pl-1">
                    <li>Спроектировал гибкое React-API для кнопок, модалок, выпадающих списков.</li>
                    <li>Написал автотесты на Jest/RTL для проверки доступности и кликабельности.</li>
                    <li>Ускорил разработку новых интерфейсов в компании на 30%.</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-6 bg-zinc-900/30 border-t border-zinc-900/60 flex flex-wrap gap-1.5">
                {["React", "TypeScript", "Tailwind CSS", "Storybook", "Jest", "RTL", "Radix UI"].map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-zinc-950 text-zinc-400 rounded text-[10px] font-mono border border-zinc-900">{t}</span>
                ))}
              </div>
            </div>

            {/* Case 4 */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-900 hover:border-zinc-800/80 transition-all flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs font-semibold text-purple-300 font-mono">Личный проект</span>
                  <span className="text-xs text-zinc-500 font-mono">Fullstack</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">Интеллектуальная E-Commerce платформа с ИИ-рекомендациями</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Демонстрационный интернет-магазин с личным кабинетом, корзиной, оплатой и интеграцией с OpenAI/Gemini для генерации персональных рекомендаций товаров.
                </p>
                
                <div className="space-y-2 pt-2">
                  <div className="text-xs text-zinc-400 font-semibold">Моя личная роль в проекте:</div>
                  <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside pl-1">
                    <li>Построил серверную часть на Node.js и Express с JWT-авторизацией.</li>
                    <li>Настроил базу данных MongoDB, реализовал гибкий полнотекстовый поиск.</li>
                    <li>Синхронизировал стейт корзины и сессий пользователей через Zustand.</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-6 bg-zinc-900/30 border-t border-zinc-900/60 flex flex-wrap gap-1.5">
                {["React.js", "Express.js", "Zustand", "Tailwind CSS", "MongoDB", "OpenAI API", "Docker"].map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-zinc-950 text-zinc-400 rounded text-[10px] font-mono border border-zinc-900">{t}</span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* AI RECRUITMENT ASSISTANT (WOW BLOCK) */}
      <section id="ai-recruiter" className="py-24 border-b border-zinc-900 bg-zinc-950 relative overflow-hidden">
        
        {/* Glow behind section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none -z-10"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 animate-pulse">
              <Brain className="w-3.5 h-3.5 text-indigo-400 glow-dot-indigo" />
              <span>AI Recruit Intelligence</span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Интерактивный ИИ-Собеседник</p>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">
              Задайте ИИ любой каверзный вопрос о квалификации Максима, или скопируйте вашу вакансию, чтобы мгновенно проанализировать совместимость и сгенерировать сопроводительное письмо!
            </p>
            <div className="w-12 h-1 bg-indigo-500 mx-auto rounded mt-4"></div>
          </div>

          {/* Recruiter Terminal Cockpit */}
          <div className="glass-panel rounded-2xl border border-indigo-500/20 overflow-hidden shadow-2xl shadow-indigo-950/20">
            
            {/* Top cockpit header */}
            <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-900 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                <div className="h-4 w-px bg-zinc-800 mx-1"></div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>maxim_recruiter_bot_v2.0.sh</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded text-indigo-400 font-mono">
                  DEMO FALLBACK ACTIVE (100% OFFLINE WORKABLE)
                </span>
              </div>
            </div>

            {/* Main Double Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              
              {/* Tab Selector Left Column */}
              <div className="lg:col-span-3 bg-zinc-950/40 border-r border-zinc-900 p-4 space-y-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 lg:gap-0">
                <button 
                  onClick={() => { setAnalysisError(null); }}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-2.5 transition-all text-xs font-semibold whitespace-nowrap ${
                    !analysisResult && !analysisLoading && !analysisError
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                      : "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  ИИ Чат-Ассистент
                </button>
                <button 
                  onClick={() => { 
                    if (!analysisResult) {
                      setJobDescription("");
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-2.5 transition-all text-xs font-semibold whitespace-nowrap ${
                    analysisResult || analysisLoading || analysisError
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                      : "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Анализатор Вакансии
                </button>
              </div>

              {/* Main Content Area Column */}
              <div className="lg:col-span-9 p-6 flex flex-col justify-between bg-zinc-900/10">
                
                {/* 1. CHAT MODE */}
                {!analysisResult && !analysisLoading && !analysisError && !jobDescription ? (
                  <div className="flex-1 flex flex-col justify-between h-full space-y-6">
                    
                    {/* Chat Messages */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 flex-1">
                      {chatMessages.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            msg.sender === "user" 
                              ? "bg-zinc-800 text-zinc-300 border border-zinc-700" 
                              : "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20"
                          }`}>
                            {msg.sender === "user" ? "HR" : "AI"}
                          </div>
                          
                          <div className="space-y-1">
                            <div className={`p-3 rounded-2xl max-w-sm sm:max-w-md text-xs leading-relaxed ${
                              msg.sender === "user"
                                ? "bg-zinc-800 text-zinc-100 rounded-tr-none border border-zinc-700"
                                : "bg-zinc-900/80 text-zinc-300 rounded-tl-none border border-zinc-800/80"
                            }`}>
                              {msg.text}
                            </div>
                            <div className={`text-[9px] text-zinc-500 ${msg.sender === "user" ? "text-right" : ""}`}>
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}

                      {chatLoading && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xs font-bold shrink-0">
                            AI
                          </div>
                          <div className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl rounded-tl-none flex items-center gap-1 select-none">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Presets Grid */}
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Рекомендуемые вопросы:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {presetQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            disabled={chatLoading}
                            onClick={() => handleSendChatMessage(q)}
                            className="p-2.5 text-left text-[11px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-all disabled:opacity-50 disabled:pointer-events-none"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat Input form */}
                    <div className="flex items-center gap-2 border-t border-zinc-900 pt-4 mt-2">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !chatLoading) {
                            handleSendChatMessage(chatInput);
                          }
                        }}
                        disabled={chatLoading}
                        placeholder="Спросите об опыте, переезде, CI/CD, тестировании..." 
                        className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all disabled:opacity-50"
                      />
                      <button 
                        onClick={() => handleSendChatMessage(chatInput)}
                        disabled={chatLoading || !chatInput.trim()}
                        className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-900 text-white rounded-xl transition-all shadow-md active:scale-95 disabled:scale-100 disabled:opacity-40"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ) : null}

                {/* 2. VACANCY ANALYZER - INPUT STATE */}
                {(jobDescription || analysisLoading || analysisError || analysisResult) && !analysisResult && !analysisLoading && !analysisError ? (
                  <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-400">Вставьте текст вакансии (Job Description):</label>
                        <button 
                          onClick={() => {
                            setJobDescription("");
                            setAnalysisResult(null);
                            setAnalysisError(null);
                          }}
                          className="text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Сбросить
                        </button>
                      </div>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Например: Требуется React/Next.js разработчик для создания логистических дашбордов. Стек: TypeScript, Tailwind CSS, Node.js, Express. Умение писать Jest автотесты..."
                        rows={8}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-xl p-4 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                      />
                    </div>

                    {/* Presets row */}
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Примеры готовых вакансий для теста:</div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {presetJDs.map((jdPreset, idx) => (
                          <button
                            key={idx}
                            onClick={() => setJobDescription(jdPreset.text)}
                            className="flex-1 p-2 text-left bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-lg text-zinc-300 transition-all text-xs font-medium"
                          >
                            ⚡ {jdPreset.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-zinc-900 pt-4 mt-2 flex justify-end">
                      <button
                        onClick={handleAnalyzeJob}
                        disabled={!jobDescription.trim()}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-900 text-white text-xs font-bold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/30 transition-all active:scale-95 disabled:scale-100 disabled:opacity-40"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-300" />
                        Запустить ИИ-Анализ вакансии
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* 3. VACANCY ANALYZER - LOADING STATE */}
                {analysisLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12 select-none">
                    
                    {/* Animated scanning radar */}
                    <div className="relative w-24 h-24 rounded-full border border-indigo-500/30 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/15 to-transparent animate-scan w-full h-[15px]"></div>
                      <Brain className="w-10 h-10 text-indigo-400 animate-pulse" />
                    </div>

                    <div className="text-center space-y-2">
                      <div className="text-xs font-bold text-white tracking-widest uppercase">ИИ анализирует соответствие...</div>
                      <p className="text-[11px] text-zinc-400 max-w-xs">
                        Сопоставляем требования вакансии с базой опыта, стеком, оптимизациями LCP в РЖД и навыками SOLID.
                      </p>
                    </div>

                    <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-[scan_1.5s_infinite] w-2/3"></div>
                    </div>
                  </div>
                )}

                {/* 4. VACANCY ANALYZER - ANALYSIS RESULT STATE */}
                {analysisResult && !analysisLoading && (
                  <div className="flex-1 flex flex-col justify-between space-y-6">
                    
                    {/* Compatibility score layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      
                      {/* Metric gauge circle */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl text-center">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          {/* Radial colored track */}
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="#1f2937" strokeWidth="8" fill="transparent" />
                            <circle cx="48" cy="48" r="40" stroke="#6366f1" strokeWidth="8" fill="transparent" 
                              strokeDasharray="251.2" 
                              strokeDashoffset={251.2 - (251.2 * analysisResult.score) / 100}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute font-bold text-2xl text-white">{analysisResult.score}%</div>
                        </div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-3">Соответствие стеку</div>
                      </div>

                      {/* Matching and gaps list */}
                      <div className="md:col-span-8 space-y-4">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-2">Совпадающие технологии:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.matchedSkills.map((s, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-medium">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">Направления для усиления:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.missingSkills.map((s, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-medium">
                                <Zap className="w-3 h-3 text-indigo-400" />
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Cover Letter Box */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          Сгенерированное сопроводительное письмо:
                        </div>
                        <button
                          onClick={handleCopyCoverLetter}
                          className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-[10px] font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1"
                        >
                          {copiedCoverLetter ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Скопировано!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-400" />
                              Копировать в буфер
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 max-h-[220px] overflow-y-auto font-mono text-[11px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {analysisResult.coverLetter}
                      </div>
                    </div>

                    <div className="border-t border-zinc-900 pt-4 flex justify-between items-center flex-wrap gap-2">
                      <div className="text-[9px] text-zinc-500 font-mono">
                        {analysisResult.simulated 
                          ? "🤖 Письмо сформировано локальным рекрутинговым движком"
                          : "🚀 Ответ сгенерирован в реальном времени нейросетью Gemini"
                        }
                      </div>
                      <button
                        onClick={() => {
                          setAnalysisResult(null);
                          setJobDescription("");
                        }}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-xl text-zinc-300 hover:text-white text-xs font-bold transition-all active:scale-95"
                      >
                        Анализировать другую вакансию
                      </button>
                    </div>

                  </div>
                )}

                {/* 5. VACANCY ANALYZER - ERROR STATE */}
                {analysisError && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <div className="text-center space-y-1">
                      <div className="text-sm font-bold text-white">Не удалось выполнить анализ</div>
                      <p className="text-xs text-zinc-400 max-w-xs">{analysisError}</p>
                    </div>
                    <button
                      onClick={() => {
                        setAnalysisError(null);
                        setAnalysisLoading(false);
                      }}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-xl text-xs text-zinc-200 transition-all font-semibold"
                    >
                      Попробовать снова
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT & FEEDBACK FORM */}
      <section id="contact" className="py-24 bg-zinc-950/40 relative">
        
        {/* Glow */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-950/5 rounded-full blur-[130px] pointer-events-none -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Форма обратной связи</h2>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Давайте создадим что-то крутое!</p>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Оставьте свои контакты, и я отвечу вам в ближайшее время. Все сообщения отправляются через реальное API.
            </p>
            <div className="w-12 h-1 bg-indigo-500 mx-auto rounded mt-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Direct Contacts Info */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Прямые контакты</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Предпочитаю общение в Telegram или по Email. Готов обсудить проекты под ключ, вакансии в штат на fullstack стек, а также проконсультировать по оптимизации производительности сайтов.
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  { icon: <Mail className="w-4 h-4 text-indigo-400" />, label: "Email", value: "maksimgoncharov112@gmail.com", href: "mailto:maksimgoncharov112@gmail.com" },
                  { icon: <Phone className="w-4 h-4 text-emerald-400" />, label: "Телефон / Мессенджеры", value: "+7 (996) 500-02-00", href: "tel:+79965000200" },
                  { icon: <Send className="w-4 h-4 text-sky-400" />, label: "Telegram", value: "@WebDev112", href: "https://t.me/WebDev112" },
                  { icon: <Github className="w-4 h-4 text-zinc-300" />, label: "GitHub Репозиторий", value: "github.com/GoncharovMaksim", href: "https://github.com/GoncharovMaksim" }
                ].map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-zinc-950 flex items-center justify-center shrink-0 border border-zinc-850 group-hover:scale-105 transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.label}</div>
                      <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-all mt-0.5">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Secure badge */}
              <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl flex items-center gap-3">
                <Lock className="w-5 h-5 text-indigo-400/80 shrink-0" />
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Ваши персональные данные защищены и отправляются строго по протоколу HTTPS. Копия отправленного письма придет на указанный вами Email.
                </p>
              </div>

            </div>

            {/* Interactive Feedback Form */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-8 rounded-2xl border border-zinc-900 shadow-xl relative overflow-hidden">
                
                {/* Form header decoration */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-indigo-500 to-emerald-500"></div>

                {!formSuccess ? (
                  <form onSubmit={handleContactSubmit} noValidate className="space-y-5">
                    
                    {/* Fields: Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Ваше имя *</label>
                      <input 
                        type="text"
                        disabled={formLoading}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (validationErrors.name) {
                            setValidationErrors(prev => {
                              const copy = { ...prev };
                              delete copy.name;
                              return copy;
                            });
                          }
                        }}
                        placeholder="Александр"
                        className={`w-full bg-zinc-950 border ${
                          validationErrors.name 
                            ? "border-red-500/50 focus:border-red-500/70 shadow-[0_0_10px_rgba(239,68,68,0.05)]" 
                            : "border-zinc-850 focus:border-indigo-500/50"
                        } rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none transition-all disabled:opacity-50`}
                      />
                      {validationErrors.name && (
                        <p className="text-[10px] text-red-400 font-medium flex items-center gap-1.5 mt-1 animate-pulse">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          {validationErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Row: Phone and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Телефон *</label>
                        <input 
                          type="tel"
                          disabled={formLoading}
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (validationErrors.phone) {
                              setValidationErrors(prev => {
                                const copy = { ...prev };
                                delete copy.phone;
                                return copy;
                              });
                            }
                          }}
                          placeholder="+7 (999) 000-00-00"
                          className={`w-full bg-zinc-950 border ${
                            validationErrors.phone 
                              ? "border-red-500/50 focus:border-red-500/70 shadow-[0_0_10px_rgba(239,68,68,0.05)]" 
                              : "border-zinc-850 focus:border-indigo-500/50"
                          } rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none transition-all disabled:opacity-50`}
                        />
                        {validationErrors.phone && (
                          <p className="text-[10px] text-red-400 font-medium flex items-center gap-1.5 mt-1 animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            {validationErrors.phone}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Email *</label>
                        <input 
                          type="email"
                          disabled={formLoading}
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (validationErrors.email) {
                              setValidationErrors(prev => {
                                const copy = { ...prev };
                                delete copy.email;
                                return copy;
                              });
                            }
                          }}
                          placeholder="partner@company.ru"
                          className={`w-full bg-zinc-950 border ${
                            validationErrors.email 
                              ? "border-red-500/50 focus:border-red-500/70 shadow-[0_0_10px_rgba(239,68,68,0.05)]" 
                              : "border-zinc-850 focus:border-indigo-500/50"
                          } rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none transition-all disabled:opacity-50`}
                        />
                        {validationErrors.email && (
                          <p className="text-[10px] text-red-400 font-medium flex items-center gap-1.5 mt-1 animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            {validationErrors.email}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Fields: Comment */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Сообщение / Комментарий *</label>
                      <textarea 
                        disabled={formLoading}
                        value={formData.comment}
                        onChange={(e) => {
                          setFormData({ ...formData, comment: e.target.value });
                          if (validationErrors.comment) {
                            setValidationErrors(prev => {
                              const copy = { ...prev };
                              delete copy.comment;
                              return copy;
                            });
                          }
                        }}
                        placeholder="Опишите ваши задачи или проект. С удовольствием отвечу!"
                        rows={5}
                        className={`w-full bg-zinc-950 border ${
                          validationErrors.comment 
                            ? "border-red-500/50 focus:border-red-500/70 shadow-[0_0_10px_rgba(239,68,68,0.05)]" 
                            : "border-zinc-850 focus:border-indigo-500/50"
                        } rounded-xl p-4 text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none transition-all disabled:opacity-50`}
                      />
                      {validationErrors.comment && (
                        <p className="text-[10px] text-red-400 font-medium flex items-center gap-1.5 mt-1 animate-pulse">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          {validationErrors.comment}
                        </p>
                      )}
                    </div>

                    {/* Error display */}
                    {formError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-zinc-900 disabled:to-zinc-900 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 disabled:scale-100 disabled:opacity-50 cursor-pointer"
                    >
                      {formLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Отправка сообщения...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-indigo-300" />
                          Отправить запрос
                        </>
                      )}
                    </button>

                  </form>
                ) : (
                  
                  // SUCCESS STATE (WOW layout)
                  <div className="space-y-6 py-4 text-center animate-fade-in">
                    
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle2 className="w-8 h-8 glow-dot-emerald animate-bounce" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Сообщение успешно отправлено!</h3>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                        Спасибо за обращение! Я получил информацию и копия письма была направлена на вашу почту.
                      </p>
                    </div>

                    {/* Developer Mock Email preview */}
                    {emailLogs && (
                      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-left space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded text-indigo-400 font-mono font-bold uppercase select-none">
                            Отладочные логи (Demo симуляция)
                          </span>
                          <button
                            onClick={() => setShowEmailLogs(!showEmailLogs)}
                            className="text-[10px] text-zinc-400 hover:text-white font-semibold transition-all"
                          >
                            {showEmailLogs ? "Скрыть подробности" : "Развернуть письма"}
                          </button>
                        </div>

                        <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
                          Так как SMTP сервер не настроен в `.env`, форма работает в демонстрационном режиме. В продакшене письма будут физически отправлены через Nodemailer.
                        </p>

                        {showEmailLogs && (
                          <div className="space-y-3 pt-2 border-t border-zinc-900/60 font-mono text-[9px] text-zinc-400 max-h-[220px] overflow-y-auto">
                            
                            <div className="p-2.5 bg-zinc-900/50 rounded-lg space-y-1">
                              <div className="text-indigo-400 font-bold">Письмо владельцу:</div>
                              <div><strong>Кому:</strong> maksimgoncharov112@gmail.com</div>
                              <div><strong>Тема:</strong> {emailLogs.ownerEmail.subject}</div>
                              <div className="mt-1.5 p-2 bg-zinc-950 rounded text-zinc-500 max-h-[80px] overflow-y-auto select-text selection:bg-indigo-500/20" dangerouslySetInnerHTML={{ __html: emailLogs.ownerEmail.html }}></div>
                            </div>

                            <div className="p-2.5 bg-zinc-900/50 rounded-lg space-y-1">
                              <div className="text-emerald-400 font-bold">Копия отправителю:</div>
                              <div><strong>Кому:</strong> {emailLogs.userEmail.to}</div>
                              <div><strong>Тема:</strong> {emailLogs.userEmail.subject}</div>
                              <div className="mt-1.5 p-2 bg-zinc-950 rounded text-zinc-500 max-h-[80px] overflow-y-auto select-text selection:bg-indigo-500/20" dangerouslySetInnerHTML={{ __html: emailLogs.userEmail.html }}></div>
                            </div>

                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setFormSuccess(false);
                        setEmailLogs(null);
                        setShowEmailLogs(false);
                      }}
                      className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-xl text-zinc-300 hover:text-white text-xs font-bold transition-all active:scale-95"
                    >
                      Отправить еще одно сообщение
                    </button>

                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-zinc-950 border-t border-zinc-900 py-8 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 font-bold text-xs">
              M
            </div>
            <span className="text-xs text-zinc-400">
              © {new Date().getFullYear()} Гончаров Максим Александрович. Все права защищены.
            </span>
          </div>

          <div className="text-[10px] text-zinc-650 font-mono">
            Создано с помощью React 19, Next.js 16 и ИИ-Ассистента Antigravity.
          </div>

          <div className="flex gap-4">
            <a 
              href="https://github.com/GoncharovMaksim" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-500 hover:text-white transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="mailto:maksimgoncharov112@gmail.com" 
              className="text-zinc-500 hover:text-white transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
