# 📱 GitHub Dashboard – React Native + Expo

Una aplicación móvil desarrollada con React Native + Expo, diseñada para consultar perfiles de GitHub, ver estadísticas detalladas y explorar repositorios con una experiencia moderna, fluida y multiplataforma (Android / iOS).

# 🚀 Características principales
🔍 Búsqueda de usuarios

Entrada con debounce (evita rate limit de GitHub).
Renderizado reactivo utilizando React Query (cache inteligente, retries, loading states).
📊 Estadísticas del usuario

Incluye:

Total de repositorios
Total de estrellas
Lenguaje más utilizado
Gráfico mini–barras generado dinámicamente
Último repo actualizado
Toda la agregación se realiza en un helper aislado:

src/utils/githubStats.ts

# 📁 Listado de repositorios

Listado optimizado con FlatList

Animación de aparición progresiva (fade + slide)

Pull-to-refresh

Navegación al detalle del repo vía React Navigation

# 🎨 Theming + Multilenguaje

Tema claro/oscuro con ThemeContext

Internacionalización con I18nContext (ES/EN)

Persistencia automática en memoria del usuario

# 🧩 Arquitectura limpia

Hooks separados para la data:
useGithubUser() – useGithubRepos()

Capa de UI desacoplada

Cálculo de estadísticas en módulo puro y testeable

Manejo global de errores con AppErrorBoundary

# 🛡️ Error Boundary

La app incluye un componente dedicado:

src/components/AppErrorBoundary.tsx

Muestra fallback UI y permite reiniciar la vista.

# 🧪 Testing (Jest + React Testing Library)

El proyecto incluye:

Configuración de Jest para TypeScript

Tests unitarios para la lógica de agregación:
src/__tests__/githubStats.test.ts

## Ejemplo de lo que se prueba:

Conteo total de repos
Suma de estrellas
Lenguaje más frecuente
Ordenamiento de lenguajes

# ⚠️ Nota importante sobre Expo + Jest

Expo SDK 53 introduce un nuevo runtime (“winter”) que genera errores al ejecutar Jest, incluso en tests puros (sin React Native).
Esto está registrado en issues del ecosistema y no depende del código de la app.

Por eso:

✔️ El proyecto está preparado para testing y los tests son correctos.
❗ En Expo SDK 53, la ejecución de Jest puede fallar por un bug interno en el runtime.
✔️ Los tests funcionan correctamente fuera del entorno Expo (TypeScript puro).

# ⚠️ Nota2 importante 
Se debe crear una carpeta "config" con un unico archivo "githubConfig.ts" con este contenido:

```ts
export const githubConfig = {
  baseUrl: "https://api.github.com",
  token: "REPLACE_WITH_YOUR_GITHUB_TOKEN"
};
```

pd: alcanza que el Token se genere solo con permisos de lectura. 

🏛️ Tecnologías usadas

React Native 0.76+
Expo SDK 53
React Query
React Navigation
TypeScript

Context API (Theme + I18n)
Animated API
react-native-safe-area-context
Jest (configurado)

📷 Screenshots

<p align="center">
  <img src="./assets/dashboard_dark.jpg" width="280" />
  <img src="./assets/dashboard_light.jpg" width="280" />
  <img src="./assets/details_dark.jpg" width="280" />
  
</p>