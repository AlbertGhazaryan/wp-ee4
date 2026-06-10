FROM node:20-slim
RUN apt-get update && apt-get install -y openssl
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npm install @rollup/rollup-linux-x64-gnu --save-dev

RUN npx prisma migrate dev --name init
RUN npm run build

#CMD ["npx", "react-router-serve", "./build/server/index.js"]