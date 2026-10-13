FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY App.js ./
ENV PORT=8081
EXPOSE 8081
CMD ["node", "App.js"]
