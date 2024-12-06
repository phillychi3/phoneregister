FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules node_modules/


EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]