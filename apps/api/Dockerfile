# Entorno docente: construcción del backend desde el monorepo.
FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
RUN npm install

COPY apps/api ./apps/api
RUN npm run build:api

ENV NODE_ENV=production
EXPOSE 4000
CMD ["sh", "-c", "npm run db:migrate:prod -w @gradecloud/api && npm run db:seed:prod -w @gradecloud/api && npm run start -w @gradecloud/api"]
