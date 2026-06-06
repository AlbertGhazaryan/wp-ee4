FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy the rest of the app 
COPY . .

EXPOSE 3000
CMD ["npm", "start"]