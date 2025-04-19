# Use Node.js 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
# Install Next.js globally (optional, but recommended)
RUN npm install -g next

# Copy the rest of the application code
COPY . .

# Expose ports
EXPOSE 3000

CMD ["npm", "run", "dev"]
