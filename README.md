# Waleska Astral Backoffice

Panel de administración para gestionar el contenido, servicios, productos, reservas y configuración del sitio web de **Waleska Astral**.

> Repositorio del backend API: [waleska-astral-api](https://github.com/kb2910/waleska-astral-api)

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 |
| Lenguaje | TypeScript |
| Bundler | Vite |
| Routing | React Router DOM 7 |
| HTTP Client | Axios |
| i18n | react-i18next |
| Iconos | Font Awesome 6 |
| Estilos | CSS custom (dark theme) |

---

## Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/kb2910/waleska-astral-backoffice.git
cd waleska-astral-backoffice

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env .env.local
# Editar .env.local con la URL de tu API

# Iniciar en modo desarrollo
npm run dev
```

La aplicación se ejecuta en `http://localhost:5173`

---

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8004` | URL del backend API (waleska-astral-api) |

---

## Credenciales de Acceso

| Campo | Valor |
|-------|-------|
| Email | `adminWa@wa.com` |
| Password | `waleska2026` |

---

## Funcionalidades

### Autenticación
- Login JWT con almacenamiento en `localStorage`
- Redirección automática al login si el token expira (401)
- Protected routes con AuthContext

### Gestión de Contenido
- **Content** — Secciones del sitio (banner, about, header, footer, contact) con pestañas ES/EN
- **Services** — Servicios de astrología/tarot con CRUD completo
- **Products** — Productos (barajas, cursos, digitales) con CRUD completo
- **Promotions** — Promociones con códigos de descuento
- **Testimonials** — Testimonios de clientes con calificación
- **Chat Config** — Configuración del chatbot IA (prompt, modelo, keywords)

### Gestión Operativa
- **Bookings** — Reservas con filtros de estado (pendiente, confirmada, completada, cancelada)
- **Settings** — Configuración general del sitio (guardado masivo)
- **Media** — Biblioteca de archivos con upload y preview

### Dashboard
- Tarjetas de estadísticas (servicios, productos, reservas, testimonios, promociones)
- Acciones rápidas con acceso directo a cada módulo

### UI/UX
- **Sidebar colapsable** — Se contrae a solo iconos
- **Buscador en sidebar** — Filtra módulos por nombre traducido y keywords
- **Selector de idioma** — Cambio ES/EN con persistencia en localStorage
- **Dark theme** — Colores de marca Waleska (negro #0d0d0d + púrpura #7122d0)
- **Responsive** — Sidebar se auto-colapsa en móvil
- **i18n completo** — Todos los textos de la UI traducidos (130+ keys)

---

## Estructura del Proyecto

```
src/
├── config/
│   └── api.ts                    # URL base de la API
├── services/
│   ├── api.ts                    # Instancia Axios + interceptor JWT
│   ├── auth.service.ts           # Login, logout, token management
│   ├── content.service.ts        # CRUD ContentSection
│   ├── service.service.ts        # CRUD Service
│   ├── product.service.ts        # CRUD Product
│   ├── promotion.service.ts      # CRUD Promotion
│   ├── booking.service.ts        # Read/Update/Delete Booking
│   ├── testimonial.service.ts    # CRUD Testimonial
│   ├── settings.service.ts       # Read/Update/Bulk Settings
│   ├── chat-config.service.ts    # CRUD ChatConfig
│   └── media.service.ts          # Upload/Delete MediaAsset
├── contexts/
│   ├── AuthContext.tsx            # Estado de autenticación global
│   └── LanguageContext.tsx        # Estado de idioma global
├── i18n/
│   ├── index.ts                  # Configuración i18next
│   └── locales/
│       ├── es.json               # Traducciones Español
│       └── en.json               # Traducciones English
├── components/
│   ├── Layout.tsx                # Sidebar + Topbar + Outlet
│   └── Layout.css                # Estilos del layout
├── pages/
│   ├── Login.tsx                 # Formulario de login
│   ├── Dashboard.tsx             # Panel con stats
│   ├── Content.tsx               # CRUD contenido web
│   ├── Services.tsx              # CRUD servicios
│   ├── Products.tsx              # CRUD productos
│   ├── Promotions.tsx            # CRUD promociones
│   ├── Bookings.tsx              # Tabla de reservas
│   ├── Testimonials.tsx          # CRUD testimonios
│   ├── Settings.tsx              # Configuración del sitio
│   ├── ChatConfig.tsx            # Config del chatbot
│   └── Media.tsx                 # Biblioteca de archivos
│   └── *.css                     # Estilos por página
├── App.tsx                       # Rutas y ProtectedRoute
├── main.tsx                      # Entry point con providers
└── index.css                     # Estilos globales + variables
```

---

## Endpoints del API consumidos

Todas las llamadas van al backend `waleska-astral-api` con prefijo JWT Bearer.

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Login y obtención de token |

### Contenido
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/content?limit=500&lang=` | Listar secciones |
| POST | `/content` | Crear sección |
| PATCH | `/content/:id` | Actualizar sección |
| DELETE | `/content/:id` | Eliminar sección |

### Servicios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/services?limit=500&lang=` | Listar servicios |
| POST | `/services` | Crear servicio |
| PATCH | `/services/:id` | Actualizar servicio |
| DELETE | `/services/:id` | Eliminar servicio |

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/products?limit=500&lang=` | Listar productos |
| POST | `/products` | Crear producto |
| PATCH | `/products/:id` | Actualizar producto |
| DELETE | `/products/:id` | Eliminar producto |

### Promociones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/promotions?limit=500` | Listar promociones |
| POST | `/promotions` | Crear promoción |
| PATCH | `/promotions/:id` | Actualizar promoción |
| DELETE | `/promotions/:id` | Eliminar promoción |

### Reservas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/bookings?limit=500&status=` | Listar reservas |
| PATCH | `/bookings/:id` | Actualizar estado |
| DELETE | `/bookings/:id` | Eliminar reserva |

### Testimonios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/testimonials?limit=500&lang=` | Listar testimonios |
| POST | `/testimonials` | Crear testimonio |
| PATCH | `/testimonials/:id` | Actualizar testimonio |
| DELETE | `/testimonials/:id` | Eliminar testimonio |

### Configuración
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/settings?group=` | Listar ajustes |
| PATCH | `/settings/:key` | Actualizar ajuste |
| POST | `/settings/bulk` | Guardado masivo |
| DELETE | `/settings/:key` | Eliminar ajuste |

### Chat Config
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/chat-config?limit=500` | Listar configs |
| POST | `/chat-config` | Crear config |
| PATCH | `/chat-config/:id` | Actualizar config |
| DELETE | `/chat-config/:id` | Eliminar config |

### Media
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/uploads?limit=500&folder=` | Listar archivos |
| POST | `/uploads` | Subir archivo (multipart) |
| DELETE | `/uploads/:id` | Eliminar archivo |

---

## Comandos Disponibles

```bash
npm run dev       # Servidor de desarrollo (hot reload)
npm run build     # Build de producción
npm run preview   # Preview del build de producción
npm run lint      # Verificar código con ESLint
```

---

## Tema Visual

| Elemento | Color |
|----------|-------|
| Background principal | `#0a0a0a` |
| Sidebar | `#0d0d0d` |
| Cards | `#111` |
| Input fields | `#1a1a2e` |
| Púrpura primario | `#7122d0` |
| Púrpura hover | `#5a1aaf` |
| Texto primario | `#ccd6f6` |
| Texto secundario | `#a8b2d1` |
| Bordes | `rgba(113, 34, 208, 0.15)` |
| Activo badge | `#28a745` |
| Inactivo badge | `#666` |

---

## Licencia

Proyecto privado — Waleska Astral
