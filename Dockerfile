# Use the official Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of your app
COPY . .

# Expose your app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
