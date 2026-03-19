export const en = {
  meta: {
    lang: 'en',
    title: 'Eugene Tarasov — Fullstack Developer',
  },

  nav: {
    logo: 'tee.su',
    stack: 'Stack',
    agent: 'AI Agent',
    about: 'About',
    contact: 'Contact',
    theme_light: 'Light',
    theme_dark: 'Dark',
  },

  hero: {
    badge: 'Open for new projects',
    first_name: 'Eugene',
    last_name: 'Tarasov',
    terminal_prompt: '~/career $',
    cta_primary: '→ Hire me',
    cta_secondary: 'View stack',
    avatar_role: '// fullstack · backend · ai',
    typewriter: [
      'Fullstack Dev · 16yr experience',
      'Backend-first engineer',
      'NestJS + PHP + TypeScript',
      'AI Agent Builder',
      'Moscow, Russia 🇷🇺',
    ],
    stats: {
      years_value: '16',
      years_label: 'years coding',
      projects_value: '50',
      projects_label: 'projects shipped',
      diplomas_value: '3',
      diplomas_label: 'CS diplomas',
    },
  },

  stack: {
    section_tag: 'tech.stack',
    section_title_line1: 'Built with',
    section_title_line2: 'this arsenal',
    section_desc:
      '16 years hardcoding from bare PHP to NestJS microservices, AI agent platforms, and everything in between.',
    terminal_title: 'itee@dev ~ whoami',
    terminal_cmd: 'cat ./package.json',
    terminal_json: {
      name: 'eugene-tarasov',
      role: 'fullstack-dev',
      focus: 'backend-first',
      experience: '16yr',
      stack: ['NestJS', 'PHP', 'TypeScript', 'AI'] as string[],
      location: 'Moscow, RU',
      status: 'available',
    },
    cards: [
      {
        cat: 'backend · active',
        name: 'PHP & Laravel',
        tags: ['PHP 8', 'Laravel', 'Joomla', 'OpenCart', 'MODX'],
        tags_green: [] as string[],
      },
      {
        cat: 'backend · new stack',
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
        cat: 'AI & agents',
        name: 'AI Toolchain',
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
        cat: 'databases',
        name: 'Data Layer',
        tags: ['MySQL', 'PostgreSQL', 'TypeORM', 'Redis'],
        tags_green: ['Prisma'],
      },
      {
        cat: 'devops & infra',
        name: 'Infrastructure',
        tags: ['Linux', 'Docker', 'Git', 'Nginx', 'CI/CD'],
        tags_green: ['Traefik'],
      },
    ],
    skills_header_1: '// Proficiency',
    skills_header_2: '// Emerging skills',
    skills: [
      { name: 'PHP / Laravel', pct: 95 },
      { name: 'NestJS / Node.js', pct: 80 },
      { name: 'SQL / Databases', pct: 88 },
      { name: 'Docker / DevOps', pct: 75 },
    ],
    skills_emerging: [
      { name: 'AI Agent Dev', pct: 72 },
      { name: 'TypeScript', pct: 82 },
      { name: 'React / Next.js', pct: 68 },
      { name: 'Python / FastAPI', pct: 65 },
    ],
  },

  agent: {
    section_tag: 'ai.agent',
    section_title_line1: 'My own',
    section_title_line2: 'AI Agent',
    description:
      'Built and deployed a personal AI agent on top of modern LLMs. The agent lives on Moltbook — a social network for AI agents — and works autonomously on my behalf.',
    features: [
      'Powered by Claude API + OpenClaw engine',
      'Integrated with Moltbot and AI-API',
      'Answers technical questions about dev & architecture',
      'Public profile at moltbook.com',
      'Runs fully autonomously, 24/7',
    ],
    card_badge: 'Agent online · moltbook.com',
    card_name: 'itee_aibot',
    card_handle: 'u/itee_aibot · moltbook.com',
    card_desc:
      'Personal AI agent of Eugene Tarasov. Answers dev questions, consults on tech stack, and represents the owner 24/7 on Moltbook platform.',
    card_cta: 'Open agent profile →',
    card_url: 'https://www.moltbook.com/u/itee_aibot',
  },

  about: {
    section_tag: 'about.me',
    section_title: 'Who I am',
    bio_1:
      'Fullstack developer from Moscow. 16 years building websites, e-commerce stores, corporate portals, and custom web solutions — from scratch and to production.',
    bio_2:
      'Currently transitioning hard into modern TypeScript stack (NestJS + Next.js), integrating AI tools into real projects, and building my own AI agents on top of Claude API.',
    bio_3: 'Backend first. Always.',
    education_header: '// Education & milestones',
    timeline: [
      {
        date: '2012',
        title: 'TulGU — Cybernetics Faculty',
        desc: "Automated Control Systems · Bachelor's degree",
      },
      {
        date: '2018',
        title: 'GeekBrains',
        desc: 'Web Developer course · Full certification',
      },
      {
        date: '2021',
        title: 'Yandex Practicum',
        desc: 'Web Developer · Advanced track',
      },
      {
        date: '2024',
        title: 'AI Agent Development',
        desc: 'Built & launched itee_aibot on Moltbook · Claude API',
      },
    ],
  },

  contact: {
    section_tag: 'contact',
    title_line1: 'Got a project?',
    title_line2: "Let's talk.",
    subtitle:
      'Open for new contracts — landing pages, e-commerce, corporate portals, API backends, AI integrations.',
    links: {
      telegram: 'Telegram',
      telegram_url: 'https://t.me/tee_su',
      github: 'GitHub',
      github_url: 'https://github.com/i-tee',
      email: 'me@tee.su',
      email_url: 'mailto:me@tee.su',
      agent: '🤖 AI Agent',
      agent_url: 'https://www.moltbook.com/u/itee_aibot',
    },
  },

  footer: {
    copy: '© 2026 Eugene Tarasov',
    tagline: 'tee.su · backend-first · always',
  },
}
