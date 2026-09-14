#-----BASE STAGE--------
FROM node:24 AS base
RUN mkdir -p /home/node/app && chown -R node /home/node
WORKDIR /home/node/app
USER node

#-----DEPENDENCIES STAGE--------
FROM base AS dependencies
COPY --chown=node package.json package.json
COPY --chown=node package-lock.json package-lock.json
RUN npm install --include=dev --legacy-peer-deps

#-----BUILD STAGE--------
FROM dependencies AS build
COPY --from=dependencies --chown=node /home/node/app/package.json package.json
COPY --chown=node . .
RUN npm run build

#-----PRODUCTION DEPENDENCIES STAGE--------
FROM dependencies AS production-dependencies
COPY --from=dependencies --chown=node /home/node/app/package.json package.json
COPY --from=dependencies --chown=node /home/node/app/node_modules node_modules
RUN npm prune --production --legacy-peer-deps

#-----PRODUCTION STAGE--------
FROM node:24-alpine AS production-runner
RUN apk add --no-cache -U tzdata
ENV TZ=Asia/Kolkata
RUN cp /usr/share/zoneinfo/${TZ} /etc/localtime
USER node
WORKDIR /home/node/app
COPY --from=production-dependencies --chown=node /home/node/app/package.json package.json
COPY --from=production-dependencies --chown=node /home/node/app/node_modules node_modules
COPY --from=build --chown=node /home/node/app/.next .next
COPY --from=build --chown=node /home/node/app/public public
CMD ["npm", "run", "start"]
