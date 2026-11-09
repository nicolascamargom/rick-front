# Rick and Morty App

App móvil para buscar personajes de Rick and Morty por nombre o por número y ver su detalle.

La app consulta primero mi propia API ([rick-api](https://github.com/nicolascamargom/rick-api), en Express + MySQL). Si esa API no responde, usa la [API pública de Rick and Morty](https://rickandmortyapi.com), así que siempre muestra resultados.

## Tecnologías
React Native · Expo Router · TypeScript

## Pantallas
- **Búsqueda:** escribe un nombre o un número de personaje.
- **Detalle:** imagen y datos del personaje.

<!-- Agrega aquí 2 capturas de la app. -->

## Cómo correrlo

```bash
npm install
npx expo start
```

Para usar tu propia API, cambia la IP `192.168.x.x:3000` en `app/(tabs)/index.tsx` y en `app/CharacterDetail.tsx` por la de tu computador.
