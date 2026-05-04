FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY dist ./dist

ENV PORT=8080

CMD ["node", "dist/index.js"]