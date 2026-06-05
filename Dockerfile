FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Remove CLI packages (not needed in production)
RUN npm remove @shopify/app @shopify/cli

# Clean up dev dependencies to reduce image size
RUN npm prune --production

EXPOSE 3000
CMD ["npm", "start"]