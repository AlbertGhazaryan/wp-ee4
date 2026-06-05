FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000

# Run the app server, not shopify commands
CMD ["npm", "start"]