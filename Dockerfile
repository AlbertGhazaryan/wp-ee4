FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install @rollup/rollup-linux-x64-gnu --save-dev

RUN npm run build

CMD ["npx", "react-router-serve", "./build/server/index.js"]