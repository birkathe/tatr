# Как выложить демо на profile.online

Сайт — статическое React-приложение. Домен покупаете/уже купили на **GoDaddy**, а сам сайт лучше хостить на **Vercel** (бесплатно). GoDaddy тогда только держит домен и DNS.

Плашка **DEMO** должна остаться: это не настоящий банк.

## Вариант A — Vercel (рекомендую)

### 1. Аккаунт и загрузка проекта

1. Зайдите на https://vercel.com и зарегистрируйтесь (можно через GitHub).
2. На GitHub создайте репозиторий и загрузите папку `tatra-banka-ib` (без `node_modules` и `dist`).
3. На Vercel: **Add New → Project → Import** этот репозиторий.
4. Framework: Vite. Build command: `npm run build`. Output: `dist`.
5. Нажмите **Deploy**.

После деплоя будет временный адрес вида `https://something.vercel.app` — сайт уже должен открываться.

### 2. Привязать profile.online

В проекте Vercel:

1. **Settings → Domains**
2. Добавьте `profile.online` и `www.profile.online`

Vercel покажет DNS-записи. Обычно это:

| Type | Name | Value |
|------|------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

### 3. DNS в GoDaddy

1. Зайдите на https://dcc.godaddy.com
2. **My Products → Domains → profile.online → DNS** (Manage DNS)
3. Удалите парковочные записи GoDaddy на `@` (часто A на `Parked` / их IP, и CNAME `www` на `parked`).
4. Добавьте записи из таблицы выше.
5. Сохраните. SSL на Vercel выпустится сам, обычно за 5–30 минут (иногда до 24 часов).

После этого `https://profile.online` откроет это демо.

---

## Вариант B — хостинг GoDaddy (если купили Web Hosting)

1. На компьютере соберите сайт:

```bat
start.bat
```

или в папке проекта:

```bat
npm run build
```

Появится папка `dist`.

2. В GoDaddy откройте **cPanel → File Manager → public_html**.
3. Удалите дефолтный `index.html` хостинга.
4. Загрузите **содержимое** `dist` (не саму папку): `index.html`, `assets`, `favicon.svg`, `.htaccess`.
5. В DNS домена записи A/`www` должны указывать на IP хостинга GoDaddy (они сами это делают, если домен и хостинг в одном аккаунте).

Файл `.htaccess` нужен, чтобы страницы `/platby`, `/ucty` и т.д. не давали 404.

---

## Проверка

- Откройте `https://profile.online`
- Вход: PID `0511034199` / пароль `k?ymw7vJ` / код Čítačky `051103`
- Обновите страницу на `/platby` — приложение должно остаться, а не показать ошибку хостинга
