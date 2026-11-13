# CLAUDE.md — архитектурный обзор tee.su

Этот документ — память проекта для будущих сессий Claude (и людей). Здесь
зафиксированы все **нестандартные решения**, **подводные камни** и
**паттерны**, к которым мы пришли путём проб и инцидентов. Если в проекте
что-то выглядит странно — сначала ищи объяснение здесь.

Пошаговая установка на сервер — в [README.md](README.md#production-deployment).

---

## Что это вообще

Персональный сайт-визитка [tee.su](https://tee.su) — Eugene Tarasov,
fullstack-разработчик и автор MCP-серверов.

Архитектура: **monorepo** с двумя независимыми приложениями (frontend +
backend) + nginx + Postgres, всё в Docker. Production — один VPS.

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
- Медиа — локальный диск `backend/uploads` (`STORAGE_DRIVER=local`), S3 —
  опционально через переключатель (см. "Хранилище медиа")

### Инфраструктура

- Docker + Docker Compose: 4 контейнера — `nginx`, `frontend`, `backend`, `db`
- Nginx — контейнер `nginx:alpine`, конфиг примонтирован из `nginx/nginx.conf`
- Let's Encrypt SSL, обновление через webroot
- GitHub Actions для авто-деплоя по push в `main`

---

## Структура проекта

```
tee-su/
├── .github/workflows/deploy.yml   ← GitHub Actions auto-deploy
├── frontend/
│   ├── public/                    ← favicons, manifest, og-image
│   ├── next.config.ts             ← rewrite /uploads → backend
│   └── src/
│       ├── app/
│       │   ├── layout.tsx         ← root layout + JSON-LD + AnchorScroll + аналитика
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
│   ├── seed/                      ← сид восстановления контента (см. "Инциденты")
│   ├── uploads/                   ← медиа при STORAGE_DRIVER=local (не в git)
│   ├── scripts/pre-bundle.js      ← сборка бандла AdminJS на этапе Docker build
│   └── src/
│       ├── admin/                 ← AdminJS конфиг
│       ├── seo-meta/              ← SEO-настройки (singleton entity)
│       ├── images/                ← Image entity + S3UploadService
│       └── profile/, skills/, skill-groups/, education/
├── nginx/nginx.conf               ← reverse proxy + SSL + редирект-домены
├── docker-compose.yml             ← dev
├── docker-compose.prod.yml        ← prod
└── deploy.sh                      ← скрипт деплоя (вызывается из Actions)
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

**Почему так:** менять SEO в админке без правки кода. Один источник правды.

### 2. JSON-LD Person.image — это `ImageObject`, не строка

В `layout.tsx` рендерится Schema.org Person с полем:

```json
"image": {
  "@type": "ImageObject",
  "url": "https://tee.su/uploads/black.jpg",
  "contentUrl": "https://tee.su/uploads/black.jpg"
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

## Хранилище медиа — переключатель `STORAGE_DRIVER`

`backend/.env`: `STORAGE_DRIVER=local` (по умолчанию) или `s3`.

- **local** — AdminJS кладёт файл в `backend/uploads/`, в БД (`image.url`)
  хранится только ключ (`black.jpg`). `ImagesService` отдаёт наружу
  `/uploads/<key>`. `S3UploadService.handlePostUpload` сразу выходит.
- **s3** — после сохранения файл заливается в bucket, в БД пишется полный
  URL (`S3_PUBLIC_URL/<key>`), локальный файл удаляется.

Полные URL (`http...`) `ImagesService` не трогает — переключение драйвера
не ломает старые записи.

Как `/uploads/...` доходит до браузера:
- **prod** — nginx `location /uploads` → backend
- **dev** (nginx нет) — rewrite в `frontend/next.config.ts`
  `/uploads/:path*` → `${API_URL}/uploads/:path*`. Этот же rewrite нужен
  Next Image-оптимизатору: для относительного `src` он ходит к самому себе.
  Rewrites вшиваются в build, поэтому дефолт `API_URL` = `http://backend:4000`.

`backend/uploads/` в `.gitignore` → **файлы не в git**. В prod примонтирован
bind mount `./backend/uploads:/app/uploads`, иначе `--force-recreate`
стирал бы их. На новом сервере файлы копировать вручную (`scp`).

Сейчас (ноябрь 2026) работаем на `local`. S3 вернём после переезда обратно
на Beget.

---

## База данных

### Поведение TypeORM seed в `onModuleInit`

Каждый модуль (`profile`, `seo-meta`, `skill-groups`, ...) имеет
`onModuleInit()`, который **создаёт дефолтную запись только если таблица
пустая**. Это значит:

- Чистый клон → запускается → БД заполняется дефолтами из кода
- Изменения через AdminJS → сохраняются в БД → **сид больше не сработает**
- Менять дефолты в коде после первого запуска **не имеет смысла** —
  нужно править в AdminJS

Поля дефолтов должны совпадать с колонками entity: лишние ключи TypeORM
молча игнорирует (так `experience: 16` в сиде профиля годами ничего не
записывал, колонка называется `experience_start`).

### Сид восстановления контента

`backend/seed/restore-2026-11.sql` — реальный контент сайта (SeoMeta,
профиль, 6 групп / 42 навыка, 2 картинки). Перезаписывает таблицы:

```bash
docker exec -i tee-su-db psql -U postgres -d teesu < backend/seed/restore-2026-11.sql
```

Применять после первого старта бэкенда (таблицы создаёт `synchronize: true`).
Если контент менялся в AdminJS — сид устарел, свежий источник правды —
бэкап `/root/backups/`.

---

## Кеширование на фронте

`pageService.ts` использует Next.js fetch с `next: { revalidate: 3600 }`
для всех запросов к API (`/seo-meta`, `/images`, `/profile`, ...).

**Это значит:** изменения в AdminJS → видны на сайте максимум через 1 час
ИЛИ сразу после пересоздания контейнера фронтенда (`--force-recreate`).

`deploy.sh` всегда использует `--force-recreate`, поэтому любой деплой
сбрасывает кеш и подтягивает свежие данные.

Увидеть изменения админки прямо сейчас без деплоя:
```bash
cd /var/www/tee-su
docker compose -f docker-compose.prod.yml up -d --force-recreate frontend
```

---

## Деплой

### GitHub Actions (`.github/workflows/deploy.yml`)

Триггер: `push` в `main`. Через `appleboy/ssh-action` подключается к VPS
с приватным ключом из secrets и запускает `deploy.sh`.

Секреты репо:
- `SSH_HOST` — `tee.su` (домен, а не IP — переезд VPS не ломает деплой,
  достаточно сменить DNS и ключ)
- `SSH_USER` — `root`
- `SSH_PRIVATE_KEY` — содержимое `~/.ssh/github_deploy` с сервера
- `PROJECT_PATH` — `/var/www/tee-su`

Рабочая ветка — `develop`, в `main` мержим перед выкаткой. Перед мержем
всегда `git pull origin main`: на GitHub в `main` бывают merge-коммиты от PR.

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

## SSL — Let's Encrypt

Три сертификата: `tee.su`, `mrtorres.ru`, `xab.su` (каждый с `www.`).

### Обновление — webroot + systemd

Certbot кладёт challenge-файл в `/var/www/certbot` (bind mount в
nginx-контейнер), nginx отдаёт его на порту 80 по location
`/.well-known/acme-challenge/`. nginx при этом не останавливается.

- Запуск обновления — `certbot.timer` (ставится пакетом certbot, дважды в
  сутки). Отдельной cron-строки для SSL **нет**.
- После успешного обновления хук
  `/etc/letsencrypt/renewal-hooks/deploy/restart-nginx.sh` перезапускает
  nginx-контейнер, чтобы он подхватил новые файлы.
- Во всех `/etc/letsencrypt/renewal/*.conf` должно быть
  `authenticator = webroot`. Проверка: `certbot renew --dry-run`.

### Первичный выпуск на новом сервере

Курица и яйцо: `nginx.conf` ссылается на файлы сертификатов, без них nginx
не стартует, а webroot требует работающего nginx. Решение:

1. До первого деплоя порт 80 свободен → выпустить `certbot certonly --standalone`.
2. Задеплоить.
3. `certbot reconfigure --cert-name <домен> --webroot -w /var/www/certbot`
   — переключить обновление на webroot.

Шаг 3 обязателен — см. июньский инцидент.

### Bind mount `/var/www/certbot`

В `docker-compose.prod.yml` — **bind mount**, не named volume: certbot
работает на хосте и должен писать туда же, куда смотрит nginx в контейнере.
С named volume certbot папку не видит.

---

## Редирект-домены mrtorres.ru и xab.su

Это **редиректы на tee.su**, но с полноценным SSL. Зачем серт для
редиректа? Чтобы браузер не показывал предупреждение при заходе на
`https://mrtorres.ru` ДО того как сработает 301-редирект.

В `nginx.conf` для каждого:
- HTTP-блок: отдаёт `/.well-known/acme-challenge/` + редирект на `https://tee.su`
- HTTPS-блок: подключает свой серт + редирект на `https://tee.su`

Let's Encrypt не интересует контент сайта — только что мы владеем доменом
(DNS указывает на наш IP + можем отдать challenge-файл). Если домен
перестанет указывать на сервер — его серт не обновится, а nginx не
стартует без файла серта. Тогда убрать блоки домена из `nginx.conf`.

---

## Аналитика

`YandexMetrika` (97734688) + `GoogleAnalytics` (G-479TXB6T05). Обе через
`next/script` с `strategy="afterInteractive"` — грузятся после
гидратации, не блокируют первый рендер. В `view-source:` их `<script>` не
видно — они вставляются в DOM после гидратации; проверять в DevTools
(`typeof ym`, `typeof gtag`).

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

## Нестандартные решения в бэкенде

### `bodyParser: false` (`backend/src/main.ts`)

AdminJS сам парсит body (multer для upload). С включённым bodyParser
AdminJS ломается.

### `/uploads/` redirect middleware (`backend/src/main.ts`)

AdminJS upload-feature при отображении картинки подставляет `/uploads/`
перед значением из БД. Если там полный S3-URL, получается
`/uploads/https://...`. Middleware ловит этот случай и делает 302 на
реальный URL. Без этого в админке не отображались бы превью S3-картинок.

### AdminJS SeoMeta — singleton-защита

В `admin.module.ts` для ресурса `SeoMeta`:

```ts
actions: {
  new: { isAccessible: false },
  delete: { isAccessible: false },
  bulkDelete: { isAccessible: false },
},
```

Скрывает "Создать", "Удалить", "Массовое удаление" — SeoMeta должен быть
одной строкой. Если удалить — отвалятся JSON-LD, OG-теги, аналитика.

### Pre-bundle AdminJS (`backend/scripts/pre-bundle.js`)

Запускается на этапе Docker build, генерирует `adminjs/bundle.js`
заранее. Три тонкости:

1. `process.env.NODE_ENV = 'production'` **до** `require('adminjs')` —
   router AdminJS проверяет env на этапе require.
2. `ADMIN_JS_TMP_DIR = 'adminjs'` (без точки) — Express `send` модуль
   режет dotfile-папки по умолчанию (`dotfiles: 'ignore'`), и `.adminjs/`
   возвращает 404.
3. `uploadFileFeature(...)` ВЫЗЫВАЕТСЯ (не просто импортируется) —
   иначе `AdminJS.bundle()` для upload-компонентов не вызывается.

Без всех трёх админка показывает "Component X has not been bundled".

---

## Известные подводные камни

### Docker build OOM на сервере с 2 ГБ

`nest build` (tsc с типами AdminJS) требует >1 ГБ кучи, дефолтный лимит
Node — около половины RAM. Решение в `backend/Dockerfile`:
`NODE_OPTIONS=--max-old-space-size=1536` для шага сборки + swap 2 ГБ на
сервере. Swap сам по себе не помогает — упираемся в лимит кучи V8, а не
в память системы.

### Next.js Image Optimization 400

Если `next.config.ts` не скопирован в runner-стейдж frontend Dockerfile,
оптимизация валится с 400, а rewrite `/uploads` не работает.
Решение: явный COPY в Dockerfile (уже есть).

### Frontend fetch-кеш не очищается soft restart'ом

`docker compose restart frontend` НЕ помогает — Next.js fetch-кеш в
`.next/cache/fetch-cache/` живёт в writable-слое контейнера. Нужен
`up -d --force-recreate frontend`. Это встроено в `deploy.sh`.

В **dev** `frontend/.next` лежит на хосте (bind mount `./frontend:/app`),
поэтому кеш переживает даже `--force-recreate`. Если фронт рисует старые
данные — удалить `frontend/.next/dev/cache/fetch-cache`.

### Dev: порт фронта 3100

В `docker-compose.yml` фронт проброшен на **3100** — порт 3000 на машине
разработчика занят другими проектами. Внутри контейнера по-прежнему 3000.

---

## Инциденты

### Июнь 2026 — протух SSL tee.su

Первый серт tee.su выпускался скриптом в **standalone-mode** (стоп nginx →
certbot → старт nginx). В renewal-конфиге осталось
`authenticator = standalone`. Обновление не могло занять порт 80 (там
docker nginx), падало молча, серт истёк. mrtorres.ru и xab.su выпускались
сразу с `--webroot` и обновлялись нормально.

Урок: после любого standalone-выпуска переключать обновление на webroot
(`certbot reconfigure`) и проверять `certbot renew --dry-run`.

### Ноябрь 2026 — падение Beget

Умер VPS на Beget (сайт, прод-БД, бэкапы в `/root/backups/`), S3-ключи
перестали работать (`InvalidAccessKeyId`). Off-site бэкапов не было.

Как восстановили:
- **Код** — GitHub.
- **Контент БД** — снепшот Web Archive от 2026-08-07: meta-теги, JSON-LD и
  RSC-payload Next.js (в нём сериализованы `skillGroups` со всеми навыками и
  ID). Разобран в `backend/seed/webarchive-2026-08-07.json`, из него
  сгенерирован `backend/seed/restore-2026-11.sql`.
- **Фото** — оригиналы у владельца. Запасной источник был в
  `frontend/.next/dev/cache/images/`: кеш Next Image-оптимизатора хранит
  уменьшенные копии всех когда-либо показанных картинок.
- **S3** — отключён переключателем `STORAGE_DRIVER=local`.
- **Хостинг** — временно Timeweb (см. "Состояние сервера").

Урок: бэкапы на том же сервере, что и БД, — это не бэкапы.

---

## Технический долг

Зафиксировано, чтобы помнить: это **известный плохой паттерн**, а не
"так задумано".

### Нет off-site бэкапов

Бэкапы в `/root/backups/` лежат на том же VPS. Если сервер умрёт — умрут
вместе с БД (уже случилось в ноябре 2026). Нужна копия вне сервера: S3
другого провайдера или rsync на другую машину.

### `synchronize: true` в TypeORM

`backend/src/app.module.ts` — на старте TypeORM **автоматически
синхронизирует схему БД с entity-классами**. Удобно, но в проде может
случайно сдропать колонку при рефакторинге.

Правильно: миграции + `synchronize: false`. Пока работает, потому что
схема меняется только добавлением колонок. Сделать миграции — перед первым
удалением/переименованием колонки.

### PostgreSQL креды — `postgres/postgres`

Слабый пароль в `docker-compose.prod.yml`, но порт БД наружу не проброшен —
доступ только из Docker-сети. Если выставлять порт или подключаться с
хоста — пароль менять обязательно.

### Сессии AdminJS в памяти

`express-session` с `MemoryStore` (в логе бэкенда предупреждение
`MemoryStore is not designed for a production environment`). Последствия:
при каждом деплое админ разлогинивается. Утечка памяти на одного
администратора несущественна.

### Nginx: нет HTTP/2 и security headers

В HTTPS-блоках `listen 443 ssl;` без `http2 on;` — отдаётся HTTP/1.1.
Не настроены `Strict-Transport-Security`, `X-Content-Type-Options`,
`Referrer-Policy`. Минимум для добавления в HTTPS-блок tee.su:

```nginx
http2 on;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
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

- `revalidate: 3600` в `pageService.ts` — изменения админки видны через час
  ИЛИ после `--force-recreate`.
- `--force-recreate` в `deploy.sh` — иначе изменения в БД не подхватываются.
- Bind mount `/var/www/certbot` — на named volume не переключать.
- `authenticator = webroot` в renewal-конфигах — на standalone не менять.
- Bind mount `./backend/uploads:/app/uploads` в prod — без него медиа
  стирается при каждом деплое.
- `NODE_OPTIONS=--max-old-space-size=1536` в `backend/Dockerfile` — без
  него сборка падает на сервере с 2 ГБ.
- `bodyParser: false` в `backend/src/main.ts` — AdminJS ломается.
- `ADMIN_AUTH_ENABLED=true` в prod `.env` — иначе `/admin` открыт всем.
- Docker volume `tee-su_pgdata` — **ВСЯ БАЗА**. `docker compose down -v`
  или `docker volume rm` уничтожат контент.

---

## Полезные команды на проде

```bash
# Статус контейнеров
docker compose -f /var/www/tee-su/docker-compose.prod.yml ps

# Логи
docker logs tee-su-frontend --tail 50
docker logs tee-su-backend --tail 50

# Сертификаты и проверка обновления
certbot certificates
certbot renew --dry-run
systemctl list-timers certbot.timer

# Ручной передеплой без git push
cd /var/www/tee-su && bash deploy.sh

# Сброс fetch-кеша фронта без сборки
cd /var/www/tee-su && \
  docker compose -f docker-compose.prod.yml up -d --force-recreate frontend

# Запрос к фронтенду минуя nginx (дебаг)
docker exec tee-su-frontend wget -qO- http://localhost:3000/ | head -100

# Ручной бэкап БД
docker exec tee-su-db pg_dump -U postgres teesu | gzip > /root/backups/teesu-manual.sql.gz

# Восстановление БД из бэкапа
gunzip -c /root/backups/teesu-YYYYMMDD.sql.gz | docker exec -i tee-su-db psql -U postgres teesu
```

---

## Состояние сервера (snapshot 13.11.2026)

Временный сервер после падения Beget. План: вернуться на Beget и
восстановить там S3.

### Базовое

| Параметр | Значение |
|---|---|
| Провайдер | Timeweb Cloud, сервер "Wild Amalthea" |
| IP | `5.42.119.135` |
| Hostname | `msk-1-vm-4z1u` |
| OS | Ubuntu 26.04.1 LTS |
| CPU / RAM / Swap | 1 vCPU 3.3 ГГц / 1.9 ГБ / 2 ГБ (`/swapfile`) |
| Disk | 28 ГБ |
| Timezone | UTC |
| Путь проекта | `/var/www/tee-su` |
| Docker / Compose | 29.9 / 5.7 |
| Certbot | 4.0 |

### DNS

A-записи `tee.su`, `mrtorres.ru`, `xab.su` и их `www.` → `5.42.119.135`.
DNS-зона управляется в панели Beget.

### Безопасность

- ✅ **UFW** — открыты только 22, 80, 443
- ✅ **fail2ban** — защита SSH от перебора
- ⚠️ **SSH root** — вход по паролю (выдан Timeweb) и по ключу
- ✅ **Deploy-ключ GitHub Actions** — `~/.ssh/github_deploy`, в
  `authorized_keys` с комментарием `github-actions-deploy`

### Docker

- Named volume `tee-su_pgdata` — **вся база**
- Bind mounts:
  - `/etc/letsencrypt` → nginx (read-only) — серты
  - `/var/www/certbot` → nginx — webroot для ACME challenge
  - `/var/www/tee-su/nginx/nginx.conf` → nginx — конфиг
  - `/var/www/tee-su/backend/uploads` → backend `/app/uploads` — медиа
- `/var/www/tee-su/backend/.env` — подключается через `env_file`

### Периодические задачи

- **SSL** — `certbot.timer` (systemd) + хук
  `/etc/letsencrypt/renewal-hooks/deploy/restart-nginx.sh`.
  Серты действительны до 11.02.2027.
- **Бэкап БД** — cron root:
  ```cron
  0 4 * * * docker exec tee-su-db pg_dump -U postgres teesu | gzip > /root/backups/teesu-$(date +\%Y\%m\%d).sql.gz && find /root/backups -name "teesu-*.sql.gz" -mtime +14 -delete
  ```
  Ротация 14 дней. ⚠️ Только на этом же сервере (см. техдолг).

---

## Disaster recovery — переезд на новый сервер

Полная процедура с командами — [README.md → Production Deployment](README.md#production-deployment).
Проверена на практике 13.11.2026 (Beget → Timeweb). Порядок и то, что легко забыть:

1. **DNS** — сменить A-записи всех трёх доменов (+`www.`) заранее,
   распространение занимает время. Проверка: `nslookup tee.su 1.1.1.1`.
2. **Сервер** — пакеты, Docker, swap, UFW, клон репо (README, шаг 1).
3. **Секреты и медиа** — `scp` для `backend/.env` и `backend/uploads/*`.
   В серверном `.env` выставить `ADMIN_AUTH_ENABLED=true`.
4. **SSL** — standalone ДО первого деплоя (README, шаг 3).
5. **Деплой + контент** — `deploy.sh`, затем свежий бэкап
   (`gunzip ... | psql`), а если его нет — сид `restore-2026-11.sql`.
6. **SSL обновление** — `certbot reconfigure` на webroot + хук рестарта
   nginx + `certbot renew --dry-run` (README, шаг 5).
7. **Бэкапы** — cron (README, шаг 6).
8. **GitHub Actions** — новый deploy-ключ, обновить секрет
   `SSH_PRIVATE_KEY`. `SSH_HOST=tee.su` менять не нужно.
9. **Обновить этот файл** — раздел "Состояние сервера".
