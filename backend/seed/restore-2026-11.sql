-- Восстановление контента tee.su после падения Beget (ноябрь 2026).
-- Источник: снепшот Web Archive от 2026-08-07 (meta, JSON-LD, RSC payload с навыками)
-- + данные из AdminJS. Картинки — локальный диск (STORAGE_DRIVER=local),
-- файлы black.jpg / white.jpg должны лежать в backend/uploads/.
--
-- Применение (БД должна быть уже создана бэкендом — synchronize: true):
--   docker exec -i tee-su-db psql -U postgres -d teesu < backend/seed/restore-2026-11.sql
--
-- ВНИМАНИЕ: перезаписывает seo_meta, profile, skill_group, skill, image, education.

BEGIN;

TRUNCATE skill, skill_group, image, seo_meta, profile, education RESTART IDENTITY CASCADE;

INSERT INTO seo_meta (id, "title", "titleTemplate", "description", "keywords", "canonical", "author", "ogTitle", "ogDescription", "ogImage", "ogImageAlt", "ogType", "ogLocale", "ogSiteName", "twitterCard", "twitterSite", "twitterCreator", "personName", "personJobTitle", "personUrl", "personImage", "personSameAs", "robots", "themeColor", "locale", "yandexMetrikaId", "googleAnalyticsId") VALUES
  (1, 'Eugene Tarasov — Fullstack Web/AI Developer', '%s | tee.su', 'Fullstack developer with 16+ years of experience. PHP, Laravel, NestJS, Vue.js, Next, React, Docker, AI. Available for new projects.', 'fullstack developer, php, laravel, nestjs, vue, react, docker, typescript', 'https://tee.su', 'Eugene Tarasov', '', '', 'https://tee.su/uploads/black.jpg', 'Eugene Tarasov — Fullstack Developer', 'website', 'en_US', 'tee.su', 'summary_large_image', 'tee_su', 'tee_su', 'Eugene Tarasov', 'Fullstack Developer', 'https://tee.su', 'https://tee.su/uploads/black.jpg', '["https://github.com/i-tee","https://t.me/tee_su","mailto:web@tee.su"]', 'index, follow', '#1a1612', 'en', '97734688', 'G-479TXB6T05');

INSERT INTO profile (id, name, title, city, tagline, "heroText", "statsProjects", "statsBots", experience_start) VALUES
  (1, 'Eugene Tarasov', 'Fullstack WEB/AI Developer, DevOps Engineer', 'Remote · Worldwide', '', '', 0, 0, '2010-01-01');

INSERT INTO image (id, url, alt, title, name, caption, description, "mimeType", "sortOrder", "saveToS3") VALUES
  (1, 'white.jpg', 'Eugene Tarasov — fullstack developer (PHP, Laravel, Vue, React, Next.js, NestJS, TypeScript), SaaS and AI developer, founder of tee.su', 'Eugene Tarasov — Fullstack Developer (Laravel, Vue, Next.js, NestJS) | tee.su', 'Eugene Tarasov', 'Eugene Tarasov — Fullstack developer building SaaS platforms, AI tools and scalable web applications', 'Eugene Tarasov is a fullstack developer specializing in PHP, Laravel, Vue, React, Next.js, NestJS and TypeScript. Focused on building scalable SaaS platforms, AI-powered tools (Moltbot, OpenClaw), APIs, and automation systems.', 'image/jpeg', 1, false),
  (2, 'black.jpg', 'Eugene Tarasov — fullstack developer (PHP, Laravel, Vue, React, Next.js, NestJS, TypeScript), SaaS and AI developer, founder of tee.su', 'Eugene Tarasov — Fullstack Developer (Laravel, Vue, Next.js, NestJS) | tee.su', 'Eugene Tarasov', 'Eugene Tarasov — Fullstack developer building SaaS platforms, AI tools and scalable web applications', 'Eugene Tarasov is a fullstack developer specializing in PHP, Laravel, Vue, React, Next.js, NestJS and TypeScript. Focused on building scalable SaaS platforms, AI-powered tools (Moltbot, OpenClaw), APIs, and automation systems. Founder of tee.su.', 'image/jpeg', 2, false);

INSERT INTO skill_group (id, title, subtitle, "order", category) VALUES
  (6, 'AI Toolchain', '// ai & agents', 0, ''),
  (5, 'Data & Tools', '// databases & tools', 0, ''),
  (3, 'Vue & React', '// frontend', 0, ''),
  (4, 'Infrastructure', '// devops & infra', 0, ''),
  (1, 'PHP & SQL', '// backend · core', 1, ''),
  (2, 'Node.js & Python', '// backend · new stack', 2, '');

INSERT INTO skill (id, name, "isNew", "order", "groupId", level, "isHighlighted") VALUES
  (42, 'LangChain ', true, 0, 6, 0, false),
  (34, 'Anthropic', true, 0, 6, 0, false),
  (35, 'Claude Code', true, 0, 6, 0, false),
  (36, 'GitHub Copilot', false, 0, 6, 0, false),
  (37, 'DeepSeek', false, 0, 6, 0, false),
  (38, 'Kimi', false, 0, 6, 0, false),
  (39, 'QWEN', false, 0, 6, 0, false),
  (41, 'Moltbot', false, 0, 6, 0, false),
  (40, 'OpenClaw', true, 0, 6, 0, false),
  (31, 'PostgreSQL', true, 0, 5, 0, false),
  (32, 'DBeaver', true, 0, 5, 0, false),
  (33, 'MySQL Workbench', false, 0, 5, 0, false),
  (30, 'MySQL', false, 0, 5, 0, false),
  (12, 'Vue.js', false, 0, 3, 0, false),
  (13, 'React', true, 0, 3, 0, false),
  (14, 'Next.js', true, 0, 3, 0, false),
  (15, 'JavaScript', false, 0, 3, 0, false),
  (16, 'jQuery', false, 0, 3, 0, false),
  (17, 'HTML5', false, 0, 3, 0, false),
  (18, 'CSS / Sass / Less', false, 0, 3, 0, false),
  (19, 'Linux', false, 0, 4, 0, false),
  (20, 'Ubuntu', false, 0, 4, 0, false),
  (21, 'Docker', true, 0, 4, 0, false),
  (22, 'Nginx', false, 0, 4, 0, false),
  (23, 'Caddy', true, 0, 4, 0, false),
  (24, 'Git', false, 0, 4, 0, false),
  (25, 'S3', true, 0, 4, 0, false),
  (26, 'VPN', false, 0, 4, 0, false),
  (27, 'StrongSwan', false, 0, 4, 0, false),
  (28, 'IKEv2', false, 0, 4, 0, false),
  (29, 'VLESS', true, 0, 4, 0, false),
  (2, 'PHP', false, 1, 1, 0, false),
  (3, 'MySQL', false, 3, 1, 0, false),
  (5, 'PostgreSQL', true, 0, 1, 0, false),
  (6, 'REST API', false, 0, 1, 0, false),
  (7, 'OpenAPI', false, 0, 1, 0, false),
  (1, 'Laravel', false, 0, 1, 0, false),
  (8, 'Node.js', true, 0, 2, 0, false),
  (4, 'NestJS', true, 0, 2, 0, false),
  (9, 'TypeScript', true, 0, 2, 0, false),
  (11, 'GraphQL', true, 0, 2, 0, false),
  (10, 'Python', true, 0, 2, 0, false);

-- education на проде была пустой (timeline берётся из locales/*.ts)

SELECT setval(pg_get_serial_sequence('seo_meta', 'id'), 1);
SELECT setval(pg_get_serial_sequence('profile', 'id'), 1);
SELECT setval(pg_get_serial_sequence('image', 'id'), 2);
SELECT setval(pg_get_serial_sequence('skill_group', 'id'), 6);
SELECT setval(pg_get_serial_sequence('skill', 'id'), 42);

COMMIT;
