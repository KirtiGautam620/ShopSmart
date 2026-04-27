FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
FROM node:22-alpine


WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
ENV NODE_ENV=production

EXPOSE 5001

CMD ["sh", "-c", "if [ -z \"$DATABASE_URL\" ]; then echo \"WARNING: DATABASE_URL is not set. Prisma operations may fail.\"; fi && npx prisma migrate deploy && npx prisma db seed && npm start"]