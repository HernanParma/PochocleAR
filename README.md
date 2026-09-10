# PochocleAR

Aplicación web responsiva (con etapa PWA) para explorar películas y series disponibles en plataformas de streaming en **Argentina**, consumiendo la API pública de [TMDB](https://www.themoviedb.org/).

**Trabajo Integrador — Módulo 1 · Aplicaciones Móviles**

| | |
|---|---|
| **Integrantes** | Laura Arnés · Hernán Parma |
| **Repositorio** | https://github.com/HernanParma/PochocleAR |
| **Deploy (GitHub Pages)** | No hosteado. La evaluación se realiza en entorno local. |

---

## Cómo levantar el proyecto en local

### Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm (incluido con Node)
- Cuenta en TMDB y una **API Key (v3)** gratuita: [crear API Key](https://www.themoviedb.org/settings/api)
- Navegador recomendado: **Google Chrome**

### Pasos

1. Clonar el repositorio:

```bash
git clone https://github.com/HernanParma/PochocleAR.git
cd PochocleAR
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
# Windows (PowerShell / CMD)
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Editá el archivo `.env` y pegá tu clave:

```env
VITE_TMDB_API_KEY=tu_api_key_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

> El archivo `.env` **no se versiona** (está en `.gitignore`). Cada persona que clone el proyecto debe crear el suyo.

4. Correr en desarrollo:

```bash
npm run dev
```

Abrí la URL que muestra la terminal (por defecto `http://localhost:5173`).

5. Build de producción (opcional):

```bash
npm run build
npm run preview
```

Para probar la **PWA** (instalación / Service Worker), usá `npm run build` + `npm run preview`, o un servidor HTTPS / `localhost` en modo producción. En `npm run dev` el Service Worker puede no comportarse igual.

---

## Enfoque del trabajo integrador

PochocleAR nace de un problema concreto: el catálogo de streaming **cambia según el país**, y en Argentina es difícil saber rápido en qué plataforma está disponible un título. Por eso la app se pensó como una **web mobile-first** (sin fricción de instalación), consumiendo TMDB y su servicio de *Watch Providers* con región `AR`.

### Framework elegido: React + Vite

Optamos por **React 19** (permitido por la cátedra) en lugar de Vanilla JS porque el TP exige **seis vistas**, estado compartido (lista de deseos, historial, filtros, live search) y componentes reutilizables (tarjetas, grilla, navbar). **Vite** acelera el entorno de desarrollo y el build, y permite variables de entorno `VITE_*` para la API Key.

**React Router** gestiona las rutas de cada vista en una SPA (una sola página HTML, navegación sin recargar).

### Diseño sin librerías de UI

Cumpliendo la consigna, **no usamos** Bootstrap, Tailwind, Material UI ni similares. Los estilos son **CSS puro / CSS Modules**, con enfoque **mobile-first** y media queries para tablet y desktop (RF8).

### Arquitectura (estructura de recursos)

El código vive en `src/`, organizado con **arquitectura hexagonal / Clean Architecture**:

```text
src/
├── domain/           # Entidades y contratos (Movie, WishlistItem, etc.) — sin React
├── application/      # Casos de uso (búsqueda, detalle, wishlist, historial, contacto)
├── infrastructure/   # Adaptadores: Fetch/TMDB, localStorage, config
└── presentation/     # UI React: components/, views/, context/, styles/
```

Separación de responsabilidades:

- **Estructura:** HTML semántico (`header`, `nav`, `main`, `section`, `article`, `footer`)
- **Presentación:** CSS Modules + `global.css`
- **Comportamiento:** JavaScript / React

### Consumo de API (Fetch + JSON)

La comunicación con TMDB se hace con **Fetch API** y manejo explícito de errores de red y HTTP (`NetworkError` / `HttpError`). Endpoints principales:

- Live search: `/search/movie` y `/search/tv` (con debounce)
- Filtros: `/discover/movie` y `/discover/tv` con `watch_region=AR`, `with_watch_providers` y `with_genres`
- Detalle: `/movie/{id}` o `/tv/{id}` + `/watch/providers` (nodo `AR`)

No se descarga el catálogo completo: se pide **por página** y se muestran **10 resultados** con paginación (RF3).

### Persistencia

**Lista de deseos** e **historial** se guardan en `localStorage`, para que no se pierdan al cerrar el navegador. No usamos cookies: son datos locales del cliente, no de sesión servidor.

### Contacto y mapa (RF7)

Los datos del estudio están en La Plata. El mapa está centrado en la **Catedral de La Plata** (`-34.9215, -57.9536`). Se implementó un **mapa interactivo con Leaflet / React-Leaflet** (sin iframe), con marcador en esas coordenadas.

### Etapa PLUS — PWA

Se incorporó conversión a Progressive Web App con `vite-plugin-pwa`:

- **Web App Manifest:** nombre, íconos 192px y 512px (`public/`), `theme_color`, `display: standalone`
- **Service Worker** (Workbox): caché de recursos estáticos del shell (HTML, CSS, JS, imágenes)
- Posibilidad de **instalar** la app desde Chrome y uso offline básico de la interfaz cacheada

---

## Relación tecnologías ↔ requerimientos funcionales

| RF | Requerimiento | Cómo se resolvió |
|----|---------------|------------------|
| **RF1** | Home | Presentación institucional + destacados dinámicos de TMDB + acceso al buscador |
| **RF2** | Búsqueda con ≥3 filtros | Tipo (película/serie), plataforma AR, género + live search por título |
| **RF3** | Resultados | Primeros 10 ítems en grilla mobile-first + paginación; tarjetas con póster, título, fecha y rating |
| **RF4** | Detalle | Ficha completa + logos de streaming en AR; volver; agregar a wishlist; registro automático en historial |
| **RF5** | Lista de deseos | Variante B: prioridad numérica, etiqueta y nota opcional; validación en JS; `localStorage`; eliminar ítems |
| **RF6** | Historial | Visitas al detalle en orden cronológico inverso; persistencia; clic para reabrir detalle |
| **RF7** | Contacto | Datos del estudio + mapa Leaflet en coordenadas de la Catedral de La Plata |
| **RF8** | Responsive | CSS mobile-first; grilla 2 → 3 → 4 columnas según viewport |
| **PLUS** | PWA | Manifest + Service Worker + íconos; instalable / offline básico |

### Validaciones (cátedra)

Los formularios de **lista de deseos** y **contacto** usan `noValidate` y validación estricta en JavaScript (mensajes de error claros), sin depender solo de atributos HTML `required` / `type`.

---

## Vistas y rutas

| Ruta | Vista |
|------|--------|
| `/` | Home (RF1) |
| `/buscar` | Búsqueda + filtros (RF2 / RF3) |
| `/:mediaType/:id` | Detalle (RF4) — ej. `/movie/550`, `/tv/1396` |
| `/lista-deseos` | Wishlist Variante B (RF5) |
| `/historial` | Historial de visitas (RF6) |
| `/contacto` | Contacto + mapa (RF7) |

Navegación principal persistente: `Navbar` + `Footer` en todas las vistas.

---

## Stack tecnológico

- React 19 + Vite 6
- JavaScript (ES6+)
- React Router DOM
- CSS puro / CSS Modules (mobile-first)
- Fetch API
- localStorage
- Leaflet + React-Leaflet (mapa)
- vite-plugin-pwa (manifest + Service Worker)
- Arquitectura hexagonal dentro de `src/`

---

## Reglas de cátedra respetadas

- Sin Bootstrap / Tailwind / MUI / Chakra / Ant Design
- Separación estructura / presentación / comportamiento
- Validaciones de formularios en JavaScript
- Fetch con manejo explícito de errores de red y HTTP
- `watch_region=AR` y nodo `AR` en watch providers
- HTML5 semántico
- Sin tablas para el layout

---

## Notas para la evaluación

1. **Acceso al repositorio:** el repo es público en GitHub (`HernanParma/PochocleAR`). Si necesitan acceso explícito como colaboradores, avisen a Hernán Parma o Laura Arnés.
2. **API Key:** no está en el repositorio; hay que generar una propia en TMDB y cargarla en `.env`.
3. **GitHub Pages:** no aplica en esta entrega; el proyecto se corre en local con los pasos de arriba.
4. Ambos integrantes pueden explicar las decisiones técnicas (React, capas, Fetch, localStorage, filtros AR, Variante B, mapa Leaflet, PWA).
