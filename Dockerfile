# ---- build the React app ----
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY tailwind.config.js postcss.config.js ./
COPY public ./public
COPY src ./src
# Empty = same origin: nginx proxies /api, /media, /socket.io ...
ENV REACT_APP_BACKEND_URL="" REACT_APP_SOCKET_URL="" CI=false GENERATE_SOURCEMAP=false
RUN npm run build

# ---- serve it with nginx (also the single public entrypoint) ----
FROM nginx:1.25-alpine
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
