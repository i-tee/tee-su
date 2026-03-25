export const ru = {
  meta: {
    lang: 'ru',
    title: 'Евгений Тарасов — Fullstack-разработчик',
  },

  nav: {
    logo: 'tee.su',
    stack: 'Стек',
    agent: 'AI-агент',
    about: 'Обо мне',
    contact: 'Контакты',
    theme_light: 'Светлая',
    theme_dark: 'Тёмная',
  },

  hero: {
    badge: 'Открыт к новым проектам',
    first_name: 'Евгений',
    last_name: 'Тарасов',
    terminal_prompt: '~/карьера $',
    cta_primary: '→ Написать мне',
    cta_secondary: 'Смотреть стек',
    avatar_role: '// fullstack · frontend · backend · ai',
    typewriter: [
      'Fullstack Dev · 16 лет опыта',
      'PHP · Laravel · Vue.js',
      'Frontend и Backend — под ключ',
      'Разрабатываю AI-агентов',
      'Москва, Россия 🇷🇺',
    ],
    stats: {
      years_value: '16',
      years_label: 'лет в разработке',
      projects_value: '50',
      projects_label: 'проектов сдано',
      diplomas_value: '3',
      diplomas_label: 'профильных диплома',
    },
  },

  stack: {
    section_tag: 'tech.stack',
    section_title_line1: 'Мой рабочий',
    section_title_line2: 'арсенал',
    section_desc:
      '16 лет по всему стеку — PHP и Vue на фронте и бэке, NestJS-микросервисы, AI-агенты и всё что между ними.',
    terminal_title: 'itee@dev ~ whoami',
    terminal_cmd: 'cat ./package.json',
    terminal_json: {
      name: 'eugene-tarasov',
      role: 'fullstack-dev',
      focus: 'end-to-end',
      experience: '16лет',
      stack: ['PHP', 'Laravel', 'Vue', 'AI'] as string[],
      location: 'Москва, RU',
      status: 'доступен',
    },
    cards: [
      {
        cat: 'основной стек',
        name: 'PHP & Laravel',
        tags: ['PHP 8', 'Laravel', 'Joomla', 'OpenCart', 'MODX'],
        tags_green: [] as string[],
      },
      {
        cat: 'frontend · основной',
        name: 'Vue & React',
        tags_green: ['Vue.js', 'Next.js'],
        tags: ['HTML5', 'CSS/Sass', 'TypeScript'],
      },
      {
        cat: 'расширенный стек',
        name: 'Node.js & Python',
        tags_green: ['NestJS', 'FastAPI'],
        tags: ['REST', 'GraphQL', 'TypeScript'],
      },
      {
        cat: 'AI и агенты',
        name: 'AI-инструменты',
        tags_green: [
          'Claude API',
          'Claude Code',
          'OpenClaw',
          'Moltbot',
          'LangChain',
        ],
        tags: [] as string[],
      },
      {
        cat: 'базы данных',
        name: 'Слой данных',
        tags: ['MySQL', 'PostgreSQL', 'TypeORM', 'Redis'],
        tags_green: ['Prisma'],
      },
      {
        cat: 'devops & инфра',
        name: 'Инфраструктура',
        tags: ['Linux', 'Docker', 'Git', 'Nginx', 'CI/CD'],
        tags_green: ['Traefik'],
      },
    ],
    skills_header_1: '// Основной стек',
    skills_header_2: '// Также в работе',
    skills: [
      { name: 'PHP / Laravel', pct: 95 },
      { name: 'Vue.js / Frontend', pct: 88 },
      { name: 'SQL / Базы данных', pct: 88 },
      { name: 'Docker / DevOps', pct: 75 },
    ],
    skills_emerging: [
      { name: 'NestJS / Node.js', pct: 80 },
      { name: 'TypeScript', pct: 82 },
      { name: 'React / Next.js', pct: 68 },
      { name: 'Python / FastAPI', pct: 65 },
    ],
  },

  agent: {
    section_tag: 'ai.agent',
    section_title_line1: 'Работа с',
    section_title_line2: 'AI и агентами',
    description:
      'Делаю AI-продукты под конкретные задачи — персональные ассистенты, корпоративные чат-боты, консультанты в узких нишах. Каждый агент обучается на нужной базе знаний, дообучается под бизнес и встраивается в нужные каналы.',
    features: [
      'Персональные и корпоративные AI-агенты и чат-ассистенты',
      'Боты под нишу — поддержка, консалтинг, онбординг',
      'Дообучение на собственных данных под конкретный бизнес',
      'Работаю с OpenAI, Anthropic, open-source и другими LLM API',
      'Интеграция через LangChain, кастомные пайплайны и другие инструменты',
    ],
    card_badge: 'Онлайн · moltbook.com',
    card_name: 'itee_aibot',
    card_handle: 'u/itee_aibot · moltbook.com',
    card_desc:
      'Мой персональный агент на Moltbook — соцсети для AI-ботов. Живёт там самостоятельно: читает ленту, переписывается с другими ботами и представляет меня на платформе.',
    card_cta: 'Открыть профиль агента →',
    card_url: 'https://www.moltbook.com/u/itee_aibot',
  },

  about: {
    section_tag: 'about.me',
    section_title: 'Кто я такой',
    bio_1:
      'Fullstack-разработчик из Москвы. 16 лет создаю сайты, интернет-магазины, корпоративные порталы и нестандартные веб-решения — и фронт, и бэк, с нуля и до продакшена.',
    bio_2:
      'PHP & Laravel на сервере, Vue.js на клиенте — это мой основной стек. Там где нужно — работаю с NestJS, React и Python. И интегрирую AI в реальные проекты с тех пор, как инструменты стали достаточно зрелыми.',
    bio_3: 'Владею обеими сторонами стека.',
    education_header: '// Образование и вехи',
    timeline: [
      {
        date: '2012',
        title: 'ТулГУ — Факультет кибернетики',
        desc: 'Автоматизация систем управления · Специалист',
      },
      {
        date: '2018',
        title: 'GeekBrains',
        desc: 'Web-разработчик · Полный курс с сертификатом',
      },
      {
        date: '2021',
        title: 'Яндекс Практикум',
        desc: 'Web-разработчик · Продвинутый трек',
      },
      {
        date: '2025',
        title: 'AI-агент разработка',
        desc: 'Создал и запустил itee_aibot на Moltbook · Claude API',
      },
    ],
  },

  contact: {
    section_tag: 'контакты',
    title_line1: 'Есть проект?',
    title_line2: 'Давайте обсудим.',
    subtitle:
      'Открыт для новых задач — лендинги, магазины, корпоративные сайты, API-бэкенды, AI-интеграции.',
    links: {
      telegram: 'Telegram',
      telegram_url: 'https://t.me/tee_su',
      github: 'GitHub',
      github_url: 'https://github.com/i-tee',
      email: 'web@tee.su',
      email_url: 'mailto:web@tee.su',
      agent: '🤖 AI-агент',
      agent_url: 'https://www.moltbook.com/u/itee_aibot',
    },
  },

  footer: {
    copy: '© 2026 Евгений Тарасов',
    tagline: 'tee.su · fullstack · web & AI',
  },
}
