# Tasku
Full-stack task manager built with Expo Router and an Express + Prisma API. Create tasks, add reminders, favorite items, and keep everything synced to your account.

## Features
- Email/password auth with JWT, SecureStore session persistence, and a seeded demo/guest account (`demo@tasku.com` / `password123`)
- Task CRUD with notes, category tags, optional image attachments, search filter, favorite toggle, and detail view
- Reminder date/time picker that feeds the calendar tab and upcoming list (app requests notification permission for local nudges)
- Calendar tab with marked reminder dates plus quick stats on total and upcoming reminders
- Profile tab with avatar upload and stats (tasks, favorites, reminders) plus logout
- Settings tab with light/dark theme toggle (persisted) and a local data reset button for reminders/storage cleanup

## Tech Stack
- Mobile app: Expo Router (React Native), Formik + Yup, AsyncStorage, Expo SecureStore, Expo Image Picker/Notifications, react-native-calendars UI
- API: Node/Express, Prisma ORM on PostgreSQL, JWT auth, Zod validation middleware, CORS enabled
- Tooling: ESLint (Expo config)

## Project Structure
- `app/` – Expo app screens, contexts, UI, and API client
- `server/` – Express API, Prisma schema/migrations, and seed script

## Getting Started
1) API
- `cd server && npm install`
- Create `server/.env` with your values:
  ```
  DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>
  DIRECT_URL=postgres://<user>:<password>@<host>:<port>/<db>
  PORT=3000
  JWT_SECRET=choose-a-secret
  PRISMA_CLIENT_ENGINE_TYPE=binary
  ```
- Run migrations and seed demo data: `npm run prisma:migrate` then `npm run prisma:seed`
- Start the API: `npm start` (or `npm run dev` for nodemon)
- Health check: `GET /health`

2) Mobile app
- From the repo root: `npm install`
- Create `.env` with `EXPO_PUBLIC_BASE_URL=http://<your-ip>:3000` (use your machine’s LAN IP so the device/simulator can reach the API)
- Start Expo: `npm start` and open on a simulator or device
- Log in with the demo account above or create a new account from the register screen

## API Quick Reference
- `POST /auth/register` – `{ email, password }`
- `POST /auth/login` – `{ email, password }`
- `GET /tasks` – list user tasks
- `POST /tasks` – create task
- `GET /tasks/:id` – task detail
- `PATCH /tasks/:id` – update task fields (title, description, category, favorite, reminderAt, imageUrl)
- `DELETE /tasks/:id` – remove task
