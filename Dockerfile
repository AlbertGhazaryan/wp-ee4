FROM node:20-slim
RUN apt-get update && apt-get install -y openssl
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install @rollup/rollup-linux-x64-gnu --save-dev
RUN find . -name schema.prisma
RUN npx prisma generate
RUN npm run build

CMD ["npx", "react-router-serve", "./build/server/index.js"]