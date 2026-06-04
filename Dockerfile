FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Build the app (if needed)
RUN npm run build

# Expose the port (Shopify apps typically use 8080)
EXPOSE 8080

# Start the app
CMD ["npm", "start"]