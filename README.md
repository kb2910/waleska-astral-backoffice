# Waleska Astral Backoffice

Admin panel for managing Waleska Astral's website content, services, products, bookings, and more.

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router DOM
- Axios (HTTP client)
- react-i18next (i18n ES/EN)
- Font Awesome icons

## Setup

```bash
npm install
cp .env .env.local   # set VITE_API_URL to your API
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8004` | Backend API URL |

## Login

- Email: `adminWa@wa.com`
- Password: `waleska2026`

## Features

- JWT authentication with auto-redirect
- Language switcher (ES/EN) with persistence
- Sidebar search with keyword filtering
- Dark theme with Waleska brand colors (black + purple)
- Full CRUD for: Content, Services, Products, Promotions, Testimonials, Chat Config
- Table-only views for: Bookings, Settings, Media
- Responsive sidebar (collapsible)
- Dashboard with stats and quick actions
