FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --force

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ARG NODE_ENV
ARG NEXT_PUBLIC_SCHOOL_BACKEND

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_SCHOOL_BACKEND=${NEXT_PUBLIC_SCHOOL_BACKEND}

RUN echo "NODE_ENV=${NODE_ENV}" > .env.production \
    && echo "NEXT_PUBLIC_SCHOOL_BACKEND=${NEXT_PUBLIC_SCHOOL_BACKEND}" >> .env.production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json package-lock.json ./

COPY package.json package-lock.json ./
RUN npm install --force --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3020

CMD ["npm", "run", "start"]
