FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:22-slim
WORKDIR /app
RUN apt-get update \
    && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/build build/
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules node_modules/

RUN npm rebuild better-sqlite3

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]