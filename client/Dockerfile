FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Accept backend URL at build time so Vite can bake it into the bundle
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for API proxy template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Default command for nginx:alpine will automatically process templates
# and start nginx. We don't need a custom CMD unless overriding default args.
EXPOSE 80
