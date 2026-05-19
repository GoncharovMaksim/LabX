import { NextResponse } from "next/server";

// Resume data in text form for embedding in the prompt
const RESUME_DATA = `
Имя: Гончаров Максим Александрович
Специализация: Fullstack-разработчик (React, Next.js, TypeScript, Node.js)
Опыт работы: 4 года 5 месяцев

Опыт:
1. РЖД-Технологии (Май 2022 - настоящее время) - Fullstack-разработчик:
- Оптимизация: Снизил показатель LCP на 25% через внедрение динамических импортов и оптимизацию ассетов в Next.js.
- Разработка систем: Спроектировал и реализовал модули визуализации данных реального времени для мониторинга логистических цепочек.
- Инфраструктура: Настроил автоматизированные CI/CD пайплайны (GitHub Actions), обеспечив стабильность релизов через Jest/RTL.
- UI/UX: Создал и поддерживал внутреннюю библиотеку компонентов (Tailwind CSS), что ускорило прототипирование новых сервисов на 30%.
- Архитектура: Перевел ключевые панели управления на гибридную модель SSR/SSG, добившись мгновенного отклика интерфейса.
Стек: React, Next.js, TypeScript, Redux Toolkit, Tailwind CSS, Node.js, REST API, Jest, GitHub Actions, Docker, Agile/Scrum.

2. Веб студия "Simple-Up" (Январь 2022 - Май 2022) - Frontend-разработчик:
- Full-cycle: Реализовал с нуля 3+ коммерческих проекта, обеспечив 100/100 баллов в Google PageSpeed.
- Модернизация: Успешно рефакторил legacy-код на современный стек (React + TS), внедрив принципы SOLID и DRY.
- SEO & Layout: Обеспечил Pixel Perfect верстку и высокую поисковую доступность сайтов через семантический HTML5 и SASS/SCSS.
- Build Tools: Оптимизировал конфигурации Webpack/Babel, сократив размер бандла и время TTI (Time to Interactive).
Стек: React.js, Next.js, TypeScript, SASS/SCSS, Webpack, Core Web Vitals, SEO Optimization.

Навыки:
- React, Next.js, TypeScript, Node.js, Redux Toolkit, Zustand, React Query, Express.js, MongoDB, REST API, Docker, CI/CD, GitHub Actions, JavaScript, Jest, React Testing Library, Git, Tailwind CSS, Sass, HTML5, CSS3, SSR / SSG, Performance optimization, Webpack, Vite, Storybook, Agile, Scrum, Adaptive Layout, Responsive Design.

Контакты:
- Телефон/Мессенджеры: +7 (996) 500-02-00 (Telegram, MAX)
- Telegram: @WebDev112 (https://t.me/WebDev112)
- Email: maksimgoncharov112@gmail.com
- GitHub: https://github.com/GoncharovMaksim
`;

// Helper: Sophisticated local fallback response generator
function getLocalFallbackResponse(type: string, query?: string, jobDescription?: string) {
  if (type === "chat" && query) {
    const q = query.toLowerCase();
    
    if (q.includes("next") || q.includes("react") || q.includes("hooks") || q.includes("фронтенд") || q.includes("frontend")) {
      return {
        answer: "Максим имеет глубокую экспертизу в React и Next.js (опыт более 4 лет). На последнем месте работы в «РЖД-Технологии» он перевел панели управления на гибридную модель SSR/SSG, что дало мгновенный отклик интерфейса, а также сократил LCP на 25% через динамические импорты и оптимизацию ассетов. В студии «Simple-Up» он с нуля разработал более 3 коммерческих проектов с оценкой 100/100 в Google PageSpeed.",
        simulated: true
      };
    }
    
    if (q.includes("node") || q.includes("backend") || q.includes("express") || q.includes("бэкенд") || q.includes("api") || q.includes("mongodb")) {
      return {
        answer: "Как Fullstack-разработчик, Максим активно пишет серверный код на Node.js и Express.js. Он проектирует производительные REST API, работает с базой данных MongoDB и интегрирует сервисы реального времени (например, WebSocket модули для отслеживания логистических цепочек в РЖД). В работе руководствуется принципами SOLID, DRY и KISS для поддержания чистоты серверной архитектуры.",
        simulated: true
      };
    }
    
    if (q.includes("docker") || q.includes("ci") || q.includes("cd") || q.includes("github actions") || q.includes("деплой") || q.includes("devops")) {
      return {
        answer: "Максим имеет опыт настройки процессов CI/CD с использованием GitHub Actions, обеспечивая стабильность релизов через автотесты (Jest/RTL). Он также владеет Docker для контейнеризации приложений, что позволяет стандартизировать окружение разработки и продакшена, упрощая развертывание проектов на Vercel, Docker Swarm или Kubernetes.",
        simulated: true
      };
    }
    
    if (q.includes("ai") || q.includes("ии") || q.includes("copilot") || q.includes("cursor") || q.includes("gpt")) {
      return {
        answer: "Максим активно интегрирует AI-инструменты в свой рабочий процесс: использует GitHub Copilot/Cursor для ускорения написания бойлерплейта и юнит-тестов, советуется с LLM (ChatGPT/Claude) при проектировании сложных типов TypeScript или оптимизации алгоритмов. Он считает, что AI кратно повышает продуктивность, позволяя сфокусироваться на бизнес-логике и архитектурных решениях.",
        simulated: true
      };
    }

    if (q.includes("rzd") || q.includes("ржд") || q.includes("проект") || q.includes("опыт")) {
      return {
        answer: "В «РЖД-Технологии» Максим занимался разработкой модулей визуализации данных реального времени для логистических цепочек, создал внутреннюю библиотеку UI-компонентов на Tailwind CSS (ускорила прототипирование на 30%), внедрил гибридный рендеринг SSR/SSG и оптимизировал Core Web Vitals (LCP улучшен на 25%). Работа велась в команде по методологии Agile/Scrum.",
        simulated: true
      };
    }

    if (q.includes("reloc") || q.includes("переезд") || q.includes("город") || q.includes("москва")) {
      return {
        answer: "Максим в настоящее время проживает в Москве. Он гражданин РФ, полностью готов к переезду в другие технологические хабы или регулярным командировкам. Рассматривает удаленный, гибридный или офисный форматы работы.",
        simulated: true
      };
    }

    return {
      answer: "Максим Гончаров — опытный Fullstack-разработчик (4+ года опыта, стек: React, Next.js, TypeScript, Node.js, Tailwind). Он специализируется на создании высокопроизводительных веб-приложений, оптимизации Core Web Vitals, построении модулей реального времени и автоматизации CI/CD. Вы можете спросить меня о его опыте в РЖД, навыках тестирования, DevOps, подходе к AI или готовности к переезду!",
      simulated: true
    };
  }

  if (type === "analyze" && jobDescription) {
    const jd = jobDescription.toLowerCase();
    const keywords = [
      { name: "React", keys: ["react", "реактин"] },
      { name: "Next.js", keys: ["next", "некст"] },
      { name: "TypeScript", keys: ["typescript", "ts", "тайпскрипт"] },
      { name: "Node.js", keys: ["node", "нода", "nodejs"] },
      { name: "Redux / Zustand", keys: ["redux", "toolkit", "zustand", "state"] },
      { name: "Tailwind CSS", keys: ["tailwind", "тейлвинд"] },
      { name: "SCSS / CSS Modules", keys: ["sass", "scss", "css module"] },
      { name: "CI/CD & Docker", keys: ["docker", "ci/cd", "github actions", "devops"] },
      { name: "Testing (Jest/RTL)", keys: ["jest", "rtl", "testing", "тесты", "cypress"] },
      { name: "REST API", keys: ["rest", "api", "апи"] }
    ];

    let matchCount = 0;
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    keywords.forEach(skill => {
      const isMatched = skill.keys.some(key => jd.includes(key));
      if (isMatched) {
        matchCount++;
        matchedSkills.push(skill.name);
      } else {
        // Only mark as missing if they are explicitly mentioned in common descriptions but not here,
        // or just put a couple of minor technologies as "можно усилить"
        missingSkills.push(skill.name);
      }
    });

    // Calculate match percentage: base score 65% + 3.5% per matched skill, max 98%
    const score = Math.min(65 + Math.round(matchCount * 3.3), 98);

    // Filter missing skills to show only a couple of things not found in the description
    const primaryMissing = missingSkills.slice(0, 2);

    // Generate cover letter
    let coverLetter = `Уважаемая команда найма!

Меня зовут Максим Гончаров, и я с большим интересом ознакомился с вашей вакансией. Мой стек технологий и практический опыт на 100% пересекаются с вашими требованиями к Fullstack / Frontend разработчику.

Что я могу предложить вашей команде:
`;

    if (matchedSkills.includes("React") || matchedSkills.includes("Next.js")) {
      coverLetter += `• Сильную экспертизу в React и Next.js: за более чем 4 года коммерческой разработки я реализовал с нуля несколько крупных проектов. В «РЖД-Технологии» я перевел ключевые дашборды на гибридный SSR/SSG рендеринг и оптимизировал LCP на 25% через code splitting и ленивую загрузку компонентов.\n`;
    } else {
      coverLetter += `• Опыт разработки высокопроизводительных SPA/SSR решений на React и Next.js, оптимизации показателей Core Web Vitals и SEO-доступности.\n`;
    }

    if (matchedSkills.includes("Tailwind CSS") || matchedSkills.includes("SCSS / CSS Modules")) {
      coverLetter += `• Качественную адаптивную верстку: я разрабатывал и поддерживал единую библиотеку UI-компонентов на Tailwind CSS, которая ускорила запуск новых сервисов в компании на 30%, а также владею методологиями BEM и препроцессором SASS/SCSS.\n`;
    }

    if (matchedSkills.includes("Node.js") || matchedSkills.includes("REST API")) {
      coverLetter += `• Разработку надежного бэкенда на Node.js / Express: проектировал масштабируемые REST API, интегрировал WebSocket модули реального времени и оптимизировал SQL/NoSQL запросы (MongoDB).\n`;
    }

    if (matchedSkills.includes("CI/CD & Docker") || matchedSkills.includes("Testing (Jest/RTL)")) {
      coverLetter += `• Культуру тестирования и CI/CD: покрываю код тестами с использованием Jest и React Testing Library, настраивал автоматические пайплайны GitHub Actions для непрерывной интеграции и упаковку сервисов в Docker контейнеры.\n`;
    }

    coverLetter += `
Я ценю чистоту кода (соблюдаю SOLID, DRY, KISS) и системно подхожу к решению инженерных задач благодаря высшему техническому образованию. В своей работе я также активно использую AI-инструменты (GitHub Copilot, Cursor, LLM-ассистенты), что позволяет мне писать качественный код быстрее и эффективнее.

Буду рад обсудить, как мои навыки оптимизации производительности и разработки fullstack-решений могут принести пользу вашему проекту на интервью.

С уважением,
Максим Гончаров
Telegram: @WebDev112
Телефон: +7 (996) 500-02-00
Email: maksimgoncharov112@gmail.com`;

    return {
      score,
      matchedSkills: matchedSkills.length > 0 ? matchedSkills : ["React", "TypeScript", "JavaScript"],
      missingSkills: primaryMissing.length > 0 ? primaryMissing : ["Zustand / Zustand", "Express.js"],
      coverLetter,
      simulated: true
    };
  }

  return { error: "Неверные параметры запроса" };
}

export async function POST(request: Request) {
  try {
    const { type, query, jobDescription } = await request.json();

    if (!type || (type !== "chat" && type !== "analyze")) {
      return NextResponse.json({ error: "Параметр 'type' должен быть 'chat' или 'analyze'" }, { status: 400 });
    }

    if (type === "chat" && !query) {
      return NextResponse.json({ error: "Для чата требуется параметр 'query'" }, { status: 400 });
    }

    if (type === "analyze" && !jobDescription) {
      return NextResponse.json({ error: "Для анализа требуется параметр 'jobDescription'" }, { status: 400 });
    }

    // Check for API Keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      // Use Gemini API
      console.log("[AI API] Contacting Gemini API...");
      let prompt = "";

      if (type === "chat") {
        prompt = `
You are the AI Recruiter Assistant of Maxim Goncharov. Maxim is a Senior/Middle Fullstack Web Developer with 4.4 years of experience.
Here is Maxim's resume/CV data:
${RESUME_DATA}

Answer the user's question about Maxim professionally, confidently and in a friendly recruiter tone. Answer in Russian. Keep the answer concise (2-4 paragraphs). Use bold text for key achievements.
Question: ${query}
`;
      } else {
        prompt = `
You are the AI Hiring Recruiter Assistant of Maxim Goncharov. Maxim is a Fullstack Developer (React, Next.js, TS, Node.js) with 4.4 years of experience.
Here is Maxim's resume/CV data:
${RESUME_DATA}

Analyze the following Job Description (JD) and Maxim's resume.
Provide a JSON response containing:
1. "score": a number from 50 to 99 indicating compatibility percentage.
2. "matchedSkills": array of up to 5 matching skills from Maxim's stack.
3. "missingSkills": array of up to 2 skills in the JD that Maxim does not have listed (or general skills to improve).
4. "coverLetter": a highly tailored, professionally written cover letter in Russian from Maxim to the company. In the letter, emphasize how Maxim's actual RZD and Simple-Up achievements match the requirements. Make it convincing and extremely professional.

Job Description to analyze:
${jobDescription}

Ensure the output is valid JSON *only*, formatted as:
{
  "score": 92,
  "matchedSkills": ["Next.js", "TypeScript", "Tailwind CSS"],
  "missingSkills": ["GraphQL"],
  "coverLetter": "text here..."
}
`;
      }

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: type === "analyze" ? { responseMimeType: "application/json" } : undefined,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Gemini API returned status ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (type === "chat") {
          return NextResponse.json({
            answer: responseText || "Извините, не удалось сгенерировать ответ.",
            simulated: false,
          });
        } else {
          // Parse JSON from Gemini
          const parsed = JSON.parse(responseText);
          return NextResponse.json({
            ...parsed,
            simulated: false,
          });
        }
      } catch (geminiError: any) {
        console.error("[Gemini API Error] Falling back to local engine:", geminiError);
        // Fallback to local
        const fallback = getLocalFallbackResponse(type, query, jobDescription);
        return NextResponse.json({
          ...fallback,
          warning: "Gemini API Error, fell back to local recruiting engine.",
        });
      }
    } else if (openaiKey) {
      // Use OpenAI API if configured
      console.log("[AI API] Contacting OpenAI API...");
      const systemMessage = type === "chat" 
        ? `Вы — ИИ-рекрутер-ассистент разработчика Максима Гончарова (Fullstack: React, Next.js, TS, Node.js, 4 года опыта). Ваша задача — отвечать на вопросы работодателей на основе его резюме:\n${RESUME_DATA}\nОтвечайте на русском языке, вежливо, уверенно и профессионально. Выделяйте главное жирным текстом.`
        : `Вы — ИИ-аналитик резюме разработчика Максима Гончарова. Ваша задача — проанализировать Job Description вакансии и сопоставить с резюме Максима:\n${RESUME_DATA}\nВерните ответ строго в формате JSON: {"score": число от 50 до 99, "matchedSkills": ["навык1", "навык2"], "missingSkills": ["навык3"], "coverLetter": "профессиональное сопроводительное письмо на русском, адаптированное под вакансию"}`;

      const userMessage = type === "chat" ? query : `Проанализируй вакансию:\n${jobDescription}`;

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: type === "analyze" ? { type: "json_object" } : undefined,
            messages: [
              { role: "system", content: systemMessage },
              { role: "user", content: userMessage },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API returned status ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (type === "chat") {
          return NextResponse.json({
            answer: content || "Извините, не удалось получить ответ от ИИ.",
            simulated: false,
          });
        } else {
          const parsed = JSON.parse(content);
          return NextResponse.json({
            ...parsed,
            simulated: false,
          });
        }
      } catch (openaiError: any) {
        console.error("[OpenAI API Error] Falling back to local engine:", openaiError);
        const fallback = getLocalFallbackResponse(type, query, jobDescription);
        return NextResponse.json({
          ...fallback,
          warning: "OpenAI API Error, fell back to local recruiting engine.",
        });
      }
    } else {
      // Local Recruiting Engine mode
      console.log("[AI API] Running in Demo Mode (No API keys configured).");
      const result = getLocalFallbackResponse(type, query, jobDescription);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    console.error("[AI API Route Error]:", error);
    return NextResponse.json(
      { error: `Произошла внутренняя ошибка сервера AI: ${error.message || error}` },
      { status: 500 }
    );
  }
}
