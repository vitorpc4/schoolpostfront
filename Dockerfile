FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --force

COPY .env.production .env.production

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json package-lock.json ./

RUN npm install --force --production

EXPOSE 3020

CMD ["npm", "run", "start"]
