FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci --build-from-source=sqlite3

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]