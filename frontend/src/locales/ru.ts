export const ru = {
  meta: {
    lang: 'ru',
    title: 'Евгений Тарасов — Fullstack-разработчик',
  },

  nav: {
    logo: '_itee.dev',
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
    avatar_role: '// fullstack · backend · ai',
    typewriter: [
      'Fullstack Dev · 16 лет опыта',
      'Backend в первую очередь',
      'NestJS + PHP + TypeScript',
      'Создаю AI-агентов',
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
      '16 лет хардкора: от чистого PHP до NestJS-микросервисов, AI-агентов и всего, что между ними.',
    terminal_title: 'itee@dev ~ whoami',
    terminal_cmd: 'cat ./package.json',
    terminal_json: {
      name: 'eugene-tarasov',
      role: 'fullstack-dev',
      focus: 'backend-first',
      experience: '16лет',
      stack: ['NestJS', 'PHP', 'TypeScript', 'AI'] as string[],
      location: 'Москва, RU',
      status: 'доступен',
    },
    cards: [
      {
        cat: 'backend · активный',
        name: 'PHP & Laravel',
        tags: ['PHP 8', 'Laravel', 'Joomla', 'OpenCart', 'MODX'],
        tags_green: [] as string[],
      },
      {
        cat: 'backend · новый стек',
        name: 'Node.js & Python',
        tags_green: ['NestJS', 'FastAPI', 'TypeScript'],
        tags: ['REST', 'GraphQL'],
      },
      {
        cat: 'frontend',
        name: 'Vue & React',
        tags: ['Vue.js', 'HTML5', 'CSS/Sass'],
        tags_green: ['Next.js'],
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
    skills_header_1: '// Уровень владения',
    skills_header_2: '// В активном освоении',
    skills: [
      { name: 'PHP / Laravel', pct: 95 },
      { name: 'NestJS / Node.js', pct: 80 },
      { name: 'SQL / Базы данных', pct: 88 },
      { name: 'Docker / DevOps', pct: 75 },
    ],
    skills_emerging: [
      { name: 'AI-агенты', pct: 72 },
      { name: 'TypeScript', pct: 82 },
      { name: 'React / Next.js', pct: 68 },
      { name: 'Python / FastAPI', pct: 65 },
    ],
  },

  agent: {
    section_tag: 'ai.agent',
    section_title_line1: 'Собственный',
    section_title_line2: 'AI-агент',
    description:
      'Разработал и запустил персонального AI-агента на базе современных языковых моделей. Агент живёт на платформе Moltbook — социальной сети для AI-агентов — и работает автономно от моего имени.',
    features: [
      'Построен на Claude API + движок OpenClaw',
      'Интегрирован с Moltbot и AI-API',
      'Отвечает на вопросы о разработке и архитектуре',
      'Публичный профиль на moltbook.com',
      'Работает полностью автономно, 24/7',
    ],
    card_badge: 'Агент онлайн · moltbook.com',
    card_name: 'itee_aibot',
    card_handle: 'u/itee_aibot · moltbook.com',
    card_desc:
      'Персональный AI-агент Евгения Тарасова. Помогает с вопросами по разработке, консультирует по стеку и представляет владельца 24/7 на платформе Moltbook.',
    card_cta: 'Открыть профиль агента →',
    card_url: 'https://www.moltbook.com/u/itee_aibot',
  },

  about: {
    section_tag: 'about.me',
    section_title: 'Кто я такой',
    bio_1:
      'Fullstack-разработчик из Москвы. 16 лет создаю сайты, интернет-магазины, корпоративные порталы и нестандартные веб-решения — с нуля и до продакшена.',
    bio_2:
      'Сейчас активно перехожу на современный TypeScript-стек (NestJS + Next.js), интегрирую AI-инструменты в реальные проекты и разрабатываю собственных AI-агентов на базе Claude API.',
    bio_3: 'Backend в первую очередь. Всегда.',
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
        date: '2024',
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
      email: 'me@tee.su',
      email_url: 'mailto:me@tee.su',
      agent: '🤖 AI-агент',
      agent_url: 'https://www.moltbook.com/u/itee_aibot',
    },
  },

  footer: {
    copy: '© 2026 Евгений Тарасов',
    tagline: 'tee.su · backend в первую очередь · всегда',
  },
}
