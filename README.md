# GameShelf

GameShelf est une SPA Vue 3 qui permet d'explorer un catalogue de jeux video via l'API RAWG, de construire une ludotheque personnelle persistante et de suivre des statistiques derivees.

## Fonctionnalites

- Catalogue distant pagine avec recherche temporisee, filtres et tri.
- Annulation des requetes en cours lors d'une nouvelle recherche ou d'un changement de page.
- Page detail accessible via `/games/:id`.
- Liste personnelle persistante en `localStorage`.
- Statut, note et commentaire personnels pour chaque jeu.
- Page statistiques protegee tant que la liste est vide.
- Mode sombre persistant, preference systeme au premier lancement.
- Routes chargees en lazy loading, transitions simples et PWA.
- Composants reutilisables avec props, events, slots, `v-model` personnalise et `Teleport`.

## Stack

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Vitest + Vue Test Utils
- CSS maison
- Docker + Nginx

## Configuration

L'application consomme RAWG. Il faut creer une cle gratuite sur https://rawg.io/apidocs, puis copier le fichier d'exemple :

```bash
cp .env.example .env
```

Dans `.env` :

```bash
VITE_RAWG_API_KEY=ta_cle_rawg
```

La cle est lue au build par Vite. Le fichier `.env` n'est pas versionne.

## Lancer le projet

```bash
npm install
npm run dev
```

## Tests et build

```bash
npm run test
npm run coverage
npm run build
```

La couverture cible est configuree a 50 % minimum sur le code metier teste.

## Docker

```bash
docker compose up --build
```

L'application est servie sur http://localhost:8080.

## Deploiement

Le projet peut etre deploye sur Netlify, Vercel, Render ou tout hebergeur statique compatible Vite. La variable `VITE_RAWG_API_KEY` doit etre definie dans l'environnement de build.

## Notes de rendu

RAWG impose une attribution lorsque ses donnees ou images sont utilisees. Un lien RAWG est affiche dans le pied de page.

Une assistance IA a ete utilisee pour accelerer la structuration, la generation de certains fichiers et le debogage. Cette aide est mentionnee ici conformement a la consigne du sujet.
