# CLAUDE.md — архитектурный обзор tee.su

Этот документ — память проекта для будущих сессий Claude (и людей). Здесь
зафиксированы все **нестандартные решения**, **подводные камни** и
**паттерны**, к которым мы пришли путём проб и инцидентов. Если в проекте
что-то выглядит странно — сначала ищи объяснение здесь.

---

## Что это вообще

Персональный сайт-визитка [tee.su](https://tee.su) — Eugene Tarasov,
fullstack-разработчик и автор MCP-серверов.

Архитектура: **monorepo** с двумя независимыми приложениями (frontend +
backend) + nginx + Postgres, всё в Docker. Production развёрнут на
одном VPS, домен tee.su.

---

## Стек

### Frontend — `frontend/`

- **Next.js 16** (App Router)
- **React 19** + TypeScript 5
- Без UI-библиотек — кастомные компоненты + CSS-модули
- i18n через `LocaleContext` (en / ru), хранится в cookie
- Тема (dark/light) — cookie + анти-флэш скрипт в `<head>`

### Backend — `backend/`

- **NestJS 11** + TypeORM 0.3
- **PostgreSQL 16**
- **AdminJS 6** — админ-панель на `/admin`
- S3 (Beget S3-compatible) для медиа — через `cloud.tee.su`

### Инфраструктура

- Docker + Docker Compose
- Nginx reverse proxy (на хосте, не контейнере nginx-сервиса)
- Let's Encrypt SSL (webroot mode)
- GitHub Actions для авто-деплоя по push в `main`

---

## Структура проекта

```
tee-su/
├── .github/workflows/deploy.yml   ← GitHub Actions auto-deploy
├── frontend/
│   ├── public/                    ← favicons, manifest, og-image
│   └── src/
│       ├── app/
│       │   ├── layout.tsx         ← root layout + JSON-LD + AnchorScroll
│       │   ├── metadata.ts        ← Next.js Metadata из API
│       │   ├── robots.ts          ← /robots.txt
│       │   └── sitemap.ts         ← /sitemap.xml
│       ├── components/
│       │   ├── AnchorScroll/      ← фикс hash-навигации (см. ниже)
│       │   ├── Analytics/         ← YandexMetrika + GoogleAnalytics
│       │   ├── Nav/LogoDecoder    ← фишка с расшифровкой tee.su
│       │   ├── Hero/              ← главный экран с typewriter
│       │   ├── Stack/             ← терминал-стайл стек
│       │   ├── Agent/             ← AI-агенты (+ floating Python код)
│       │   ├── Mcp/               ← MCP-серверы (+ floating код)
│       │   ├── About/             ← био + timeline
│       │   ├── Contact/           ← контакты (+ floating bash код)
│       │   └── Footer/
│       ├── locales/{en,ru}.ts     ← ВСЕ тексты сайта
│       └── services/pageService.ts ← все запросы к API
├── backend/
│   └── src/
│       ├── admin/                 ← AdminJS конфиг
│       ├── seo-meta/              ← SEO-настройки (singleton entity)
│       ├── profile/, skills/, skill-groups/, education/, images/
├── nginx/nginx.conf               ← reverse proxy + SSL
├── docker-compose.yml             ← dev
├── docker-compose.prod.yml        ← prod
├── deploy.sh                      ← скрипт деплоя (вызывается из Actions)
└── ssl-init.sh                    ← первичная инициализация SSL (legacy)
```

---

## Ключевые архитектурные решения

### 1. SEO-данные хранятся в БД, не в коде

`backend/src/seo-meta/` — entity-singleton. Один ряд в таблице, управляется
через AdminJS. Содержит:

- Базовое: title, description, keywords, canonical, author
- Open Graph: og:title/description/image/locale/type/site_name
- Twitter Card: card type, site, creator
- Schema.org Person: personName, jobTitle, image, sameAs[]
- Аналитика: yandexMetrikaId, googleAnalyticsId
- Технические: robots, themeColor, locale

Фронт читает через `GET /seo-meta`, отдаёт во все нужные места —
`<Metadata>`, JSON-LD, `<YandexMetrika>`, `<GoogleAnalytics>`.

**Почему так:** менять SEO в админке без редеплоя. Один источник правды.

### 2. JSON-LD Person.image — это `ImageObject`, не строка

В `layout.tsx` рендерится Schema.org Person с полем:

```json
"image": {
  "@type": "ImageObject",
  "url": "https://cloud.tee.su/...",
  "contentUrl": "https://cloud.tee.su/..."
}
```

**Почему `contentUrl`** — Яндекс требует именно его для индексации фото в
Яндекс.Картинках. Просто строка-URL не работает.

Email из `personSameAs` извлекается в отдельное поле `email` (схема Schema.org
не любит `mailto:` внутри sameAs).

### 3. AnchorScroll — фикс для `/#mcp` ссылок

`components/AnchorScroll/AnchorScroll.tsx` — client-компонент в layout.
Решает: в Next.js App Router нативный браузерный scroll-to-anchor срабатывает
ДО того, как async-компоненты дорендерятся, и якорь не находится.

Использует `requestAnimationFrame` для поиска элемента до 30 кадров (~500мс),
после чего делает `scrollIntoView({ behavior: 'smooth' })`.

### 4. Decorative floating code snippets

В нескольких секциях (Hero, Agent, MCP, Contact) на фоне плавают
полупрозрачные сниппеты кода. Это **декор** — `aria-hidden`, opacity ~0.15.

Тематика по секциям:
- **Hero** — deploy/SQL/NestJS
- **Agent** — Anthropic SDK, LangChain
- **MCP** — Python FastMCP
- **Contact** — bash CLI (curl, ssh, git clone)

Паттерн: section `position: relative; overflow: hidden`, сниппеты
`position: absolute`, ключевой контент `z-index: 1`.

### 5. LogoDecoder — фишка `tee.su`

`Nav/LogoDecoder.tsx` — при hover/тапе по логотипу показывает панель с
расшифровкой `T·E·E·.·S·U`:
- t — **T**arasov
- e — **E**ugene
- e — **E**vgenievich
- . — made in *(подразумевает Soviet Union из следующих строк)*
- s — **S**oviet
- u — **U**nion

С Matrix-style скрамблингом символов. Поведение:
- **Desktop:** hover открывает / mouseleave закрывает / клик по логотипу
  скроллит наверх (через href="#")
- **Mobile (hover: none):** тап открывает / тап-снаружи или авто-3.8с
  закрывает / клик по логотипу = toggle

---

## База данных — поведение TypeORM seed

Каждый модуль (`profile`, `seo-meta`, `skill-groups`, ...) имеет
`onModuleInit()`, который **создаёт дефолтную запись только если таблица
пустая**. Это значит:

- Чистый клон → запускается → БД заполняется дефолтами из кода
- Изменения через AdminJS → сохраняются в БД → **сид больше не сработает**
- Менять дефолты в коде после первого запуска **не имеет смысла** —
  нужно править в AdminJS

---

## Кеширование на фронте

`pageService.ts` использует Next.js fetch с `next: { revalidate: 3600 }`
для всех запросов к API (`/seo-meta`, `/images`, `/profile`, ...).

**Это значит:** изменения в AdminJS → видны на сайте максимум через 1 час
ИЛИ сразу после пересоздания контейнера фронтенда (`--force-recreate`).

`deploy.sh` всегда использует `--force-recreate`, поэтому любой `git push`
сбрасывает кеш и подтягивает свежие данные.

Если нужно увидеть изменения админки прямо сейчас без коммита:
```bash
cd /var/www/tee-su
docker compose -f docker-compose.prod.yml up -d --force-recreate frontend
```

---

## Деплой

### GitHub Actions (`.github/workflows/deploy.yml`)

Триггер: `push` в `main`. Через `appleboy/ssh-action` подключается к VPS
с приватным ключом из secrets и запускает `deploy.sh`.

Нужны 4 секрета в репо:
- `SSH_HOST` — `tee.su` (домен, а не IP — чтобы переезд VPS не ломал)
- `SSH_USER` — `root`
- `SSH_PRIVATE_KEY` — содержимое `~/.ssh/github_deploy` с сервера
- `PROJECT_PATH` — `/var/www/tee-su`

### `deploy.sh` на сервере

```bash
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d --force-recreate
docker compose -f docker-compose.prod.yml restart nginx
docker image prune -f
```

**Важно:** `--force-recreate` обязателен — иначе Next.js fetch-кеш не
очищается и изменения в AdminJS не подхватываются.

`restart nginx` — отдельным шагом, чтобы подхватывал новый `nginx.conf`,
который монтирован как volume (а не вшит в image).

---

## SSL — Let's Encrypt (webroot mode)

Все 3 серта (`tee.su`, `mrtorres.ru`, `xab.su`) выпущены через **webroot
challenge**.

Как это работает: certbot кладёт challenge-файл в `/var/www/certbot`
(монтирован в nginx-контейнер как bind mount), nginx отдаёт его на порту 80
по location `/.well-known/acme-challenge/`. После проверки — сертификат
получен, файлы летят в `/etc/letsencrypt/live/<domain>/`.

### Cron автообновления

```
0 3 * * * certbot renew --quiet && \
  docker compose -f /var/www/tee-su/docker-compose.prod.yml restart nginx
```

### ⚠️ Инцидент: tee.su протух (июнь 2026)

**Что случилось:** изначально `ssl-init.sh` выпускал серт для `tee.su` в
**standalone-mode** (он останавливал nginx, запрашивал серт, стартовал
заново). Конфиг renewal сохранил `authenticator = standalone`. Cron пытался
обновить, но не мог поднять свой web на порту 80 (там работал docker nginx) —
renewal падал тихо, серт истёк.

**mrtorres.ru и xab.su** обновлялись нормально, потому что их сразу
создавали с `--webroot`.

**Фикс:** перевыпустить tee.su с явным webroot:
```bash
certbot certonly --webroot -w /var/www/certbot \
  -d tee.su -d www.tee.su \
  --force-renewal \
  --non-interactive --agree-tos -m web@tee.su
```

Теперь конфиг renewal у всех трёх — webroot, cron работает.

### Bind mount для certbot

В `docker-compose.prod.yml`:
```yaml
volumes:
  - /var/www/certbot:/var/www/certbot   ← bind mount, НЕ named volume
```

Изначально был named volume — но тогда certbot на хосте не видел папку
(она внутри Docker volume драйвера). После смены на bind mount работает.

---

## Bind mount certbot — почему

Если используется named volume для `certbot-webroot:/var/www/certbot`,
то certbot на хосте не сможет писать challenge-файлы туда, куда смотрит
nginx внутри контейнера. Bind mount решает это: `/var/www/certbot` на
хосте = тот же путь в контейнере.

---

## Поддомены mrtorres.ru и xab.su

Это **редиректы на tee.su**, но с полноценным SSL. Зачем серт для
редиректа? Чтобы браузер не показывал предупреждение при заходе на
`https://mrtorres.ru` ДО того как сработает 301-редирект.

В `nginx.conf` для каждого:
- HTTP-блок: отдаёт `/.well-known/acme-challenge/` + редирект на `https://tee.su`
- HTTPS-блок: подключает свой серт + редирект на `https://tee.su`

Let's Encrypt не интересует контент сайта — только что мы владеем доменом
(DNS указывает на наш IP + можем отдать challenge-файл).

---

## Аналитика

`YandexMetrika` (97734688) + `GoogleAnalytics` (G-479TXB6T05). Обе через
`next/script` с `strategy="afterInteractive"` — грузятся после
гидратации, не блокируют первый рендер.

ID хранятся в **БД** (поля SeoMeta.yandexMetrikaId, googleAnalyticsId),
а не в .env. Если поле пустое — компонент возвращает `null`, скрипт не
рендерится.

---

## Сайтовая SEO-разметка — где что

| Что | Где |
|---|---|
| `<title>`, OG, Twitter | `app/metadata.ts` → `generateMetadata()` |
| JSON-LD Person | `app/layout.tsx` (`<script type="application/ld+json">`) |
| `theme-color` meta | `app/layout.tsx` |
| Favicon набор | `app/metadata.ts` + файлы в `public/` |
| `robots.txt` | `app/robots.ts` (генерится Next.js) |
| `sitemap.xml` | `app/sitemap.ts` (генерится Next.js) |
| Web App Manifest | `public/site.webmanifest` |

---

## Известные подводные камни

### AdminJS components.bundle.js 404 в проде

Express `send` модуль игнорирует папки-dotfiles, а `@adminjs/upload`
регистрирует компоненты только при вызове `uploadFeature()`. Решение:
- Pre-bundle на этапе Docker build через `backend/scripts/pre-bundle.js`
- `ADMIN_JS_TMP_DIR=adminjs` (без точки)
- `ADMIN_JS_SKIP_BUNDLE=true`

### Next.js Image Optimization 400

Если `next.config.ts` не скопирован в runner-стейдж frontend Dockerfile,
оптимизация внешних URL валится с 400. Решение: явный COPY в Dockerfile.

### Docker build OOM на 1GB RAM

`nest build` крашится. Решение: своп 2GB + переключить NestJS на SWC
(`"builder": "swc"` в `nest-cli.json`).

### Frontend fetch-кеш не очищается soft restart'ом

`docker compose restart frontend` НЕ помогает — Next.js fetch-кеш в
`.next/cache/fetch-cache/` живёт в writable-слое контейнера. Нужен
`up -d --force-recreate frontend`. Это уже встроено в `deploy.sh`.

---

## Полезные команды на проде

```bash
# Проверка статуса всех контейнеров
docker compose -f /var/www/tee-su/docker-compose.prod.yml ps

# Логи фронтенда / бэкенда
docker logs tee-su-frontend --tail 50
docker logs tee-su-backend --tail 50

# Проверка сертификатов
certbot certificates

# Принудительное обновление одного серта
certbot certonly --webroot -w /var/www/certbot \
  -d <domain> -d www.<domain> \
  --force-renewal --non-interactive --agree-tos -m web@tee.su

# Жёсткий передеплой без git push
cd /var/www/tee-su && bash deploy.sh

# Очистка fetch-кеша фронта без билда
cd /var/www/tee-su && \
  docker compose -f docker-compose.prod.yml up -d --force-recreate frontend

# Прямой запрос к фронтенду минуя nginx (для дебага)
docker exec tee-su-frontend wget -qO- http://localhost:3000/ | head -100
```

---

## Стиль кода

- TypeScript везде где можно
- Без комментариев в коде по умолчанию (только если объясняют НЕ-очевидный
  WHY — workaround, скрытая зависимость, etc.)
- CSS-модули вместо utility-классов
- Локализация — все тексты в `locales/{en,ru}.ts`, никаких хардкодов
- Никаких "любой", "все могу", "лучший" в копирайте — только конкретные
  технологии и числа
- Никаких упоминаний локации (Moscow/Russia) — позиционирование remote

---

## Что НЕ менять без вдумывания

- `revalidate: 3600` в `getSeoMeta()` — изменения админки видны через час
  ИЛИ через `--force-recreate`. Уменьшать только если очень нужно мгновенно.
- `--force-recreate` в `deploy.sh` — убирать нельзя, иначе изменения в БД
  не подхватываются.
- `bind mount` `/var/www/certbot` — на named volume не переключать, certbot
  с хоста перестанет видеть папку.
- `authenticator = webroot` в renewal-конфигах — на standalone не менять,
  иначе renewal будет падать с занятым портом 80.
- `bodyParser: false` в `backend/src/main.ts` — НЕ включать. AdminJS сам
  парсит body (multer для upload). С включённым bodyParser AdminJS ломается.
- `synchronize: true` в TypeORM (`app.module.ts`) — см. раздел "Технический долг".
- Docker volume `pgdata` — **ВСЯ БАЗА**. Если стереть `docker volume rm tee-su_pgdata`
  или пересоздать кастомным compose-down с флагом — потеряешь весь контент сайта.

---

## Дополнительные нестандартные решения (по коду)

### `/uploads/` redirect middleware (`backend/src/main.ts`)

AdminJS upload-feature при отображении картинки из БД подставляет
`/uploads/<url>` префикс. Если url в БД уже полный S3-URL вида
`https://cloud.tee.su/...`, получается ломанный URL вида
`/uploads/https://cloud.tee.su/...`. Middleware ловит этот случай и
делает 302 редирект на реальный URL:

```ts
app.use('/uploads', (req, res, next) => {
  const path = req.url.replace(/^\//, '');
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return res.redirect(302, path);
  }
  next();
});
```

Без этого в админке не отображались бы превью S3-картинок.

### AdminJS SeoMeta — singleton-защита

В `admin.module.ts` для ресурса `SeoMeta`:

```ts
actions: {
  new: { isAccessible: false },
  delete: { isAccessible: false },
  bulkDelete: { isAccessible: false },
},
```

Скрывает кнопки "Создать", "Удалить", "Массовое удаление" в админке —
SeoMeta должен быть один-единственный ряд (singleton). Если случайно
удалить — отвалится JSON-LD, OG-теги, аналитика.

### Pre-bundle AdminJS (`backend/scripts/pre-bundle.js`)

Запускается на этапе Docker build, генерирует `adminjs/bundle.js`
заранее. Почему важно — три тонкости:

1. `process.env.NODE_ENV = 'production'` **до** `require('adminjs')` —
   router AdminJS проверяет env на этапе require.
2. `ADMIN_JS_TMP_DIR = 'adminjs'` (без точки) — Express `send` модуль
   режет dotfile-папки по умолчанию (`dotfiles: 'ignore'`), и `.adminjs/`
   возвращает 404.
3. `uploadFileFeature(...)` ВЫЗЫВАЕТСЯ (не просто импортируется) —
   иначе `AdminJS.bundle()` для upload-компонентов не вызывается, и
   они в проде не работают.

Все три фикса вместе — иначе админка показывает "Component X has not
been bundled".

### Два nginx-конфига

- **`nginx/nginx.conf`** — актуальный production-конфиг. SSL + поддомены
  mrtorres/xab + редиректы. Монтируется в `docker-compose.prod.yml`.
- **`nginx/nginx.ssl.conf`** — **устаревший**. Был template'ом для
  `ssl-init.sh` (см. ниже). НЕ используется, не отражает текущее
  состояние. Можно удалить.

### `ssl-init.sh` — устарел

Скрипт первичной инициализации SSL: останавливал nginx, выпускал серт
в standalone-mode, копировал `nginx.ssl.conf` поверх `nginx.conf`,
поднимал nginx обратно.

**Не использовать** — сейчас все серты выпускаются через webroot
напрямую через `certbot certonly --webroot`, без остановки nginx.
Скрипт оставлен для истории.

### Frontend: `components/Greeting.tsx` — мусор

Демо-компонент из туториала. Не подключён нигде, можно удалить:

```bash
rm frontend/src/components/Greeting.tsx
```

---

## Технический долг

Зафиксировано, чтобы помнить, что это **известный плохой паттерн**, а не
"так задумано":

### `synchronize: true` в TypeORM

```ts
// backend/src/app.module.ts
TypeOrmModule.forRootAsync({
  ...
  synchronize: true,
```

Это значит, что на старте бэкенда TypeORM **автоматически синхронизирует
схему БД с entity-классами** — создаёт таблицы, добавляет колонки,
изменяет типы. Удобно для разработки, **опасно в проде** — может
случайно сдропать колонку при рефакторинге.

Что должно быть: миграции через `typeorm-migrations` + `synchronize: false`.

**Пока работает, потому что:**
- Изменения схемы идут только через изменение entity-классов
- Удалений колонок не было (только добавления — пример: `yandexMetrikaId`,
  `googleAnalyticsId`)
- БД маленькая, контент в основном через AdminJS

Когда стоит сделать миграции: перед первым реальным удалением/
переименованием колонки.

### PostgreSQL креды — `postgres/postgres`

В `docker-compose.prod.yml`:
```yaml
db:
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
```

Слабый пароль, но БД не выставлена наружу — только внутри Docker network
`tee-su_default`. Снаружи (с хоста или интернета) подключиться нельзя.

Если когда-нибудь захочется выставить порт наружу или подключаться с
хоста к prod-БД — менять пароль обязательно.

### Нет HTTP security headers

В `nginx.conf` не настроены: `Strict-Transport-Security` (HSTS),
`X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`.

Не критично для визитки, но рекомендованный минимум для production —
добавить в HTTPS server block:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## Состояние сервера (snapshot июнь 2026)

### Базовое

| Параметр | Значение |
|---|---|
| IP | `155.212.133.140` |
| OS | Ubuntu 24.04.4 LTS |
| Путь проекта | `/var/www/tee-su` |
| RAM | 3.8 GB |
| Disk | 19 GB |
| Timezone | UTC |
| Uptime ребута | 90+ дней (нужен после очередных апдейтов) |

### Безопасность

- ✅ **fail2ban active** — защита от SSH brute force
- ⚠️ **UFW inactive** — нет файрвола (полагаемся на VPS-провайдера)
- ⚠️ **SSH root login** — открыт (см. `~/.ssh/authorized_keys` для ключей деплоя)
- ✅ **GitHub Actions deploy key** — отдельный ed25519, видно как
  `github-actions-deploy` в `authorized_keys`

### Ресурсы

- БД (`tee-su_pgdata` volume) — ~47 MB
- Docker images — ~8.4 GB (active)
- Docker build cache — может расти; чистить через `docker builder prune -af`
- **Swap отсутствует** — добавлять только если будет OOM

### Docker volumes (named)

- `tee-su_pgdata` — **ВСЯ БАЗА** (контент сайта, SeoMeta, профиль, ...)
- `tee-su_certbot-webroot` — **orphan**, можно удалить (перешли на bind mount)

### Bind mounts

- `/etc/letsencrypt` → nginx (read-only) — серты
- `/var/www/certbot` → nginx — webroot для ACME challenge
- `/var/www/tee-su/nginx/nginx.conf` → nginx — конфиг
- `/var/www/tee-su/backend/.env` → backend — переменные окружения

### Cron tasks

```cron
# Обновление SSL-сертификатов (webroot mode), 3:00 UTC
0 3 * * * certbot renew --quiet && \
  docker compose -f /var/www/tee-su/docker-compose.prod.yml restart nginx

# Бэкап БД ежедневно в 4:00 UTC, ротация 14 дней
0 4 * * * docker exec tee-su-db pg_dump -U postgres teesu | \
  gzip > /root/backups/teesu-$(date +\%Y\%m\%d).sql.gz && \
  find /root/backups -name "teesu-*.sql.gz" -mtime +14 -delete
```

**Что бы стоило добавить ещё:**
- Логротейт docker-логов (могут расти)
- Off-site копия бэкапов (S3, rsync на другой сервер) — сейчас бэкапы
  лежат на том же VPS, если диск умрёт — потеряются вместе с БД

### Бэкапы БД

- **Где лежат:** `/root/backups/teesu-YYYYMMDD.sql.gz`
- **Что внутри:** полный `pg_dump` БД `teesu` (SeoMeta, Profile, Skills,
  SkillGroups, Education, Images со ссылками на S3)
- **Ротация:** хранятся 14 дней, старше — удаляются автоматически
- **Размер:** ~10-50 КБ в gzip (БД маленькая)
- **Тестирование восстановления:** периодически делать на dev/staging:
  ```bash
  gunzip -c teesu-YYYYMMDD.sql.gz | docker exec -i tee-su-db psql -U postgres teesu
  ```
- ⚠️ **Off-site копий нет** — бэкапы на том же сервере, что и БД

---

## Restoring on new VPS (disaster recovery)

Если VPS умер — порядок восстановления:

1. **Поднять Ubuntu 24.04**, поставить Docker:
   ```bash
   curl -fsSL https://get.docker.com | sh
   apt install -y certbot fail2ban
   ```

2. **Получить код:**
   ```bash
   git clone https://github.com/i-tee/tee-su /var/www/tee-su
   cd /var/www/tee-su
   ```

3. **Восстановить `.env`** (из бэкапа или пересоздать):
   ```bash
   cp backend/.env.example backend/.env
   nano backend/.env   # заполнить DB creds, S3 keys, ADMIN_PASSWORD
   ```

4. **Восстановить `pgdata` из бэкапа** (если есть pg_dump):
   ```bash
   docker compose -f docker-compose.prod.yml up -d db
   gunzip -c teesu-YYYYMMDD.sql.gz | docker exec -i tee-su-db psql -U postgres teesu
   ```

5. **Сменить DNS** A-записи tee.su / mrtorres.ru / xab.su на новый IP.

6. **Выпустить серты заново** (webroot):
   ```bash
   mkdir -p /var/www/certbot
   bash deploy.sh   # поднимет nginx без SSL не получится — см. ниже
   ```

   На самом деле нужен порядок:
   - Сначала временно убрать HTTPS блоки из nginx.conf (оставить только HTTP)
   - `docker compose up -d nginx frontend backend db`
   - `certbot certonly --webroot -w /var/www/certbot -d tee.su -d www.tee.su -d mrtorres.ru -d www.mrtorres.ru -d xab.su -d www.xab.su --non-interactive --agree-tos -m web@tee.su`
   - Вернуть полный nginx.conf
   - `docker compose restart nginx`

7. **GitHub Actions:** обновить секреты репозитория (`SSH_HOST`, ключи).

8. **Cron** для renewal — добавить заново (см. выше).
