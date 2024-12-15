FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --force

ARG NEXT_PUBLIC_SCHOOL_BACKEND
ARG NODE_ENV=production

ENV NEXT_PUBLIC_SCHOOL_BACKEND=${NEXT_PUBLIC_SCHOOL_BACKEND}

RUN echo "NEXT_PUBLIC_SCHOOL_BACKEND=${NEXT_PUBLIC_SCHOOL_BACKEND}" > .env.production

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
