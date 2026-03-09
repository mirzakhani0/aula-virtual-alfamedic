# Aula Virtual MIRZAKHANI PREU

Sistema de gestión educativa para cursos de preparación médica.

## Características

- 📱 Diseño responsive (móvil, tablet, desktop)
- 🎨 Material Design con gradientes modernos
- 🔍 Búsqueda y filtrado en tiempo real
- ▶️ Reproductor multi-plataforma (Google Drive, YouTube, Forms, etc.)
- 📊 Barra de progreso y seguimiento
- ⌨️ Atajos de teclado y gestos táctiles
- 💾 Estado persistente con localStorage
- 🔒 TypeScript para seguridad de tipos

## Tecnologías

- **Frontend**: TypeScript, CSS3, HTML5
- **Build Tool**: Vite
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Deploy**: GitHub Pages

## Estructura del Proyecto

```
PROGRAMACION EMPRESARIAL/
├── src/
│   ├── types/              # Tipos TypeScript
│   │   ├── api.types.ts
│   │   ├── state.types.ts
│   │   └── ui.types.ts
│   ├── services/           # Servicios
│   │   └── api.service.ts
│   ├── utils/              # Utilidades
│   │   ├── dom.utils.ts
│   │   ├── device.utils.ts
│   │   └── helpers.ts
│   ├── components/         # Componentes
│   │   ├── sidebar.ts
│   │   ├── player.ts
│   │   └── navigation.ts
│   ├── styles/             # Estilos CSS
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── responsive.css
│   │   └── main.css
│   ├── app.ts              # Lógica principal
│   └── main.ts             # Entry point
├── dist/                   # Build output
├── index.html              # HTML principal
├── index.html.backup       # Backup del HTML original
├── Codigo.gs               # Backend (Google Apps Script)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Instalación

### 1. Instalar Node.js

Si no tienes Node.js instalado:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Verificar instalación
node --version
npm --version
```

### 2. Instalar Dependencias

```bash
cd "/home/caronte/Documentos/PROGRAMACION EMPRESARIAL"
npm install
```

## Desarrollo

### Iniciar servidor de desarrollo

```bash
npm run dev
```

Esto iniciará el servidor en `http://localhost:5173` con hot reload automático.

### Características del modo desarrollo:

- ⚡ Hot Module Replacement (HMR)
- 🔍 TypeScript validation en tiempo real
- 🎨 CSS updates instantáneos
- 📝 Source maps para debugging

## Build para Producción

### Compilar el proyecto

```bash
npm run build
```

Esto generará la carpeta `dist/` con:
- HTML optimizado
- JavaScript minificado
- CSS minificado
- Assets optimizados

### Previsualizar build

```bash
npm run preview
```

## Despliegue a GitHub Pages

### Opción 1: Despliegue manual

```bash
# Build
npm run build

# Crear repositorio Git (si no existe)
git init
git add .
git commit -m "Initial commit"

# Agregar remote
git remote add origin https://github.com/TU_USUARIO/aula-virtual.git

# Push
git push -u origin main

# Desplegar dist/ a GitHub Pages
npm run deploy
```

### Opción 2: Despliegue automático con GitHub Actions

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Configurar GitHub Pages

1. Ve a: `Settings` → `Pages`
2. Source: `Deploy from a branch`
3. Branch: `gh-pages` → `/root`
4. Save

Tu sitio estará disponible en: `https://TU_USUARIO.github.io/aula-virtual/`

## Backend (Google Apps Script)

El backend (`Codigo.gs`) **NO necesita cambios**. Ya está configurado y funciona.

### API Endpoints:

- `?action=getSheets` - Obtiene lista de hojas
- `?action=getCourseData&sheet=NOMBRE` - Obtiene datos del curso

### URL de la API:

```
https://script.google.com/macros/s/AKfycbwdb4ToRIuHsfkfB5cXuQisJUY-qlUYxvX0d8mpkX9iGaH4eSj4QLNxhRCpRkDPQPbG/exec
```

Si necesitas cambiarla, edita: `src/services/api.service.ts`

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Build para producción |
| `npm run preview` | Previsualiza el build |
| `npm run deploy` | Despliega a GitHub Pages |

## Navegadores Soportados

- ✅ Chrome/Edge (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ✅ iOS Safari 12+
- ✅ Android Chrome

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `←` | Recurso anterior |
| `→` | Siguiente recurso |
| `Esc` | Cerrar sidebar (móvil) |
| `Ctrl + B` | Colapsar/Expandir sidebar (desktop) |

## Gestos Táctiles (Móvil)

- **Swipe derecha**: Abrir sidebar / Recurso anterior
- **Swipe izquierda**: Cerrar sidebar / Siguiente recurso
- **Swipe desde borde izquierdo**: Abrir sidebar

## Troubleshooting

### Error: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de TypeScript

```bash
npm run build
# Revisa los errores en la consola
```

### El sitio no carga en GitHub Pages

1. Verifica que `dist/` se haya subido a `gh-pages` branch
2. Verifica la configuración en Settings → Pages
3. Revisa la consola del navegador (F12) para errores

### CORS errors

Verifica que la API de Google Apps Script tenga CORS habilitado (ya debería estarlo en `Codigo.gs`).

## Mantenimiento

### Actualizar dependencias

```bash
npm update
npm outdated  # Ver paquetes desactualizados
```

### Limpiar cache

```bash
rm -rf node_modules dist .vite
npm install
npm run build
```

## Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

MIT License - Libre para uso personal y comercial.

## Contacto

MIRZAKHANI PREU - Preparación Médica

---

**Desarrollado con ❤️ usando TypeScript y Vite**
