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
    avatar_role: '// fullstack · frontend · backend · ai',
    typewriter: [
      'Fullstack Dev · 16yr experience',
      'PHP · Laravel · Vue.js',
      'Frontend & Backend · end to end',
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
      '16 years across the full stack — from PHP & Vue frontends to NestJS APIs, AI agents, and everything in between.',
    terminal_title: 'itee@dev ~ whoami',
    terminal_cmd: 'cat ./package.json',
    terminal_json: {
      name: 'eugene-tarasov',
      role: 'fullstack-dev',
      focus: 'end-to-end',
      experience: '16yr',
      stack: ['PHP', 'Laravel', 'Vue', 'AI'] as string[],
      location: 'Moscow, RU',
      status: 'available',
    },
    cards: [
      {
        cat: 'core stack',
        name: 'PHP & Laravel',
        tags: ['PHP 8', 'Laravel', 'Joomla', 'OpenCart', 'MODX'],
        tags_green: [] as string[],
      },
      {
        cat: 'frontend · core',
        name: 'Vue & React',
        tags_green: ['Vue.js', 'Next.js'],
        tags: ['HTML5', 'CSS/Sass', 'TypeScript'],
      },
      {
        cat: 'extended stack',
        name: 'Node.js & Python',
        tags_green: ['NestJS', 'FastAPI'],
        tags: ['REST', 'GraphQL', 'TypeScript'],
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
    skills_header_1: '// Core stack',
    skills_header_2: '// Also in use',
    skills: [
      { name: 'PHP / Laravel', pct: 95 },
      { name: 'Vue.js / Frontend', pct: 88 },
      { name: 'SQL / Databases', pct: 88 },
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
    section_title_line1: 'Working with',
    section_title_line2: 'AI & Agents',
    description:
      'I build AI-powered products — personal assistants, corporate chatbots, narrow-domain consultants. Each agent is tailored to its task: trained on a specific knowledge base, integrated into the right channels, fine-tuned where it makes sense.',
    features: [
      'Personal & corporate AI agents and chat assistants',
      'Domain-specific bots — support, consulting, onboarding',
      'Fine-tuning on custom data for narrow business tasks',
      'Works with OpenAI, Anthropic, open-source & other LLM APIs',
      'Integration via LangChain, custom pipelines, and other frameworks',
    ],
    card_badge: 'Online · moltbook.com',
    card_name: 'itee_aibot',
    card_handle: 'u/itee_aibot · moltbook.com',
    card_desc:
      'My personal agent on Moltbook — a social network for AI bots. It lives there on its own: reads the feed, chats with other bots, and represents me on the platform.',
    card_cta: 'Open agent profile →',
    card_url: 'https://www.moltbook.com/u/itee_aibot',
  },

  about: {
    section_tag: 'about.me',
    section_title: 'Who I am',
    bio_1:
      'Fullstack developer from Moscow. 16 years building websites, e-commerce stores, corporate portals, and custom web solutions — frontend and backend, from scratch to production.',
    bio_2:
      "PHP & Laravel on the server, Vue.js on the client — that's my home ground. I also work with NestJS, React, and Python when the project calls for it. And I've been integrating AI into real products since the tools got good enough to matter.",
    bio_3: 'I own both sides of the stack.',
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
        date: '2025',
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
      email: 'web@tee.su',
      email_url: 'mailto:web@tee.su',
      agent: '🤖 AI Agent',
      agent_url: 'https://www.moltbook.com/u/itee_aibot',
    },
  },

  footer: {
    copy: '© 2026 Eugene Tarasov',
    tagline: 'tee.su · fullstack · web & AI',
  },
}
