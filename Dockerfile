FROM node:20.19-alpine
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV NODE_OPTIONS=--max-old-space-size=512


WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npx", "react-router-serve", "./build/server/index.js"]

