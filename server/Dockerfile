FROM node:22
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 5001
CMD npx prisma migrate deploy && npx prisma db seed && npm start