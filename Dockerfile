# Use Node.js Alpine for small size
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy only package.json and lockfile first (for better caching)
COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm install

# Copy the rest of your frontend app
COPY . .

# Expose the dev server port
EXPOSE 3000

# Default command to start the dev server
CMD ["npm", "run", "dev"]
