FROM node:18-slim
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]