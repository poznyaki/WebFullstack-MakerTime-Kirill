# 🎵 MakerTime — Музична платформа

Відкрита музична платформа: користувачі завантажують власні аудіофайли на сервер,
метадані зберігаються в базі даних, а прослуховування відбувається через
інтерактивний онлайн-плеєр зі стрімінгом.

## 🧱 Стек

- **Backend:** Node.js + Express, Multer (завантаження файлів)
- **Database:** MySQL 8
- **Frontend:** React + Vite + Axios

## 📁 Структура

```
.
├── client/          # React-додаток (Vite)
├── server/          # Express API
│   ├── server.js    # точка входу сервера
│   ├── db.js        # пул з'єднань MySQL
│   └── create-db.js # створення БД і таблиць
├── init.sql         # схема БД (MySQL)
└── package.json     # корінь: запуск client + server разом
```

## ✅ Передумови

- [Node.js](https://nodejs.org/) 18+
- Запущений сервер **MySQL 8**

## 🚀 Запуск

### 1. Клонувати репозиторій

```bash
git clone https://github.com/poznyaki/WebFullstack-MakerTime-Kirill.git
cd WebFullstack-MakerTime-Kirill
```

### 2. Встановити залежності

З кореня проєкту однією командою (корінь + client + server):

```bash
npm run install-all
```

### 3. Налаштувати `.env` сервера

Створи файл `server/.env` з даними доступу до своєї MySQL:

```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_PORT=3306
DB_NAME=music_db

PORT=3000
```

### 4. Створити базу даних і таблиці

Скрипт сам створить базу `music_db` та таблиці зі схеми `init.sql`:

```bash
cd server
node create-db.js
cd ..
```

Маєш побачити:

```
Database music_db created or already exists.
Tables initialized successfully.
```

### 5. Запустити застосунок

З кореня проєкту (підніме сервер і клієнт одночасно):

```bash
npm run dev
```

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

> Запустити окремо: `npm run dev --prefix server` та `npm run dev --prefix client`.

## 🌐 API

| Метод  | Шлях       | Опис                                                        |
| ------ | ---------- | ----------------------------------------------------------- |
| `GET`  | `/`        | Health-check (перевірка з'єднання з БД)                     |
| `GET`  | `/tracks`  | Список усіх треків (нові — першими)                         |
| `POST` | `/upload`  | Завантаження треку (`multipart/form-data`)                  |

**Поля `POST /upload`:**

- `title` *(обов'язкове)* — назва треку
- `author` *(обов'язкове)* — автор
- `genre` — жанр (за замовчуванням `Unknown`)
- `audio` *(обов'язкове)* — MP3-файл (до 10 МБ)
- `cover` — обкладинка (зображення)

Завантажені файли роздаються статикою з `/static`.

## 🛠️ Troubleshooting

- **`Tables initialized successfully` не з'являється / помилка БД** — переконайся,
  що MySQL запущена і дані в `server/.env` правильні.
- **`ECONNREFUSED` на сервері** — MySQL не запущена або вказано не той `DB_PORT`.
- **Порт `3000`/`5173` зайнятий** — зміни `PORT` у `server/.env` (а `API_BASE`
  у `client/src/App.jsx` — відповідно).
