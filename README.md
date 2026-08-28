# PochocleAR

Aplicación web responsiva (PWA-ready) para explorar películas y series disponibles en plataformas de streaming en Argentina, consumiendo la API pública de TMDB.

Trabajo Integrador — Módulo 1 · Aplicaciones Móviles.

## Stack

- React 19 + Vite
- JavaScript (ES6+)
- CSS puro / CSS Modules (mobile-first, sin frameworks de UI)
- Fetch API
- Arquitectura Hexagonal (Clean Architecture)

## Estructura (`src/`)

```
src/
├── domain/           # Entidades y contratos (sin React ni librerías externas)
├── application/      # Casos de uso / lógica de negocio
├── infrastructure/   # TMDB (fetch), localStorage, config
└── presentation/     # UI React, vistas, CSS
    ├── components/
    ├── views/
    └── styles/
```

## Requisitos

- Node.js 18+
- API Key de TMDB ([crear una](https://www.themoviedb.org/settings/api))

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Configurar entorno:

```bash
copy .env.example .env
```

Editá `.env` y pegá tu clave:

```
VITE_TMDB_API_KEY=tu_api_key_aqui
```

3. Correr en desarrollo:

```bash
npm run dev
```

4. Build de producción:

```bash
npm run build
```

## Reglas de cátedra respetadas

- Sin Bootstrap / Tailwind / MUI u otras librerías de UI
- Separación estructura / presentación / comportamiento
- Validaciones de formularios en JavaScript
- Fetch con manejo explícito de errores de red y HTTP
- `watch_region=AR` para proveedores en Argentina

## Vistas

| Ruta | Vista |
|------|--------|
| `/` | Home (RF1) |
| `/buscar` | Búsqueda + filtros (RF2/RF3) |
| `/:mediaType/:id` | Detalle (RF4) |
| `/lista-deseos` | Wishlist Variante B (RF5) |
| `/historial` | Historial (RF6) |
| `/contacto` | Contacto + mapa La Plata (RF7) |
