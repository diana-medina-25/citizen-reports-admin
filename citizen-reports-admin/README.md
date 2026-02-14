# citizen-reports-admin

Panel de administración para reportes ciudadanos. React + TypeScript + Vite, listo para producción.

## Stack

- Vite, React, TypeScript
- React Router, @tanstack/react-query
- TailwindCSS
- Fetch API (sin axios)
- Arquitectura por features

## Configuración

1. Copia el archivo de ejemplo y ajusta la URL del backend si hace falta:

```bash
cp .env.example .env
```

2. La variable `VITE_API_BASE_URL` debe apuntar al API (por defecto ya está en `.env.example`).

## Desarrollo

```bash
npm install
npm run dev
```

Credenciales por defecto: `admin@citizenreport.com` / `AdminPassword123!`

## Build y deploy

```bash
npm run build
```

- **Vercel**: conectar el repo y usar el build por defecto. El `vercel.json` ya define el rewrite SPA.
- **Railway**: desplegar la carpeta `dist` como sitio estático o usar el comando `npm run build` y servir `dist`.

## Rutas

- `/login` — Inicio de sesión
- `/reports` — Listado de reportes (filtro por estado y título)
- `/reports/:id` — Detalle, cambio de estado y comentarios
- `/categories` — Listado de categorías

Todas las rutas excepto `/login` requieren token (`cr_admin_token` en localStorage). En respuestas 401 el token se limpia y se redirige a `/login`.
