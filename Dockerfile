FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start the web server
CMD ["npm", "start"]
