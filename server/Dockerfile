FROM node:18-alpine

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY worker.js worker.js
COPY index.js index.js
COPY ai.config.js ai.config.js

RUN npm install

ENTRYPOINT [ "npm run dev" ]