# Use the official Node.js 20 image as a parent image
FROM node:20-alpine
LABEL org.opencontainers.image.description "Backend docker image for safe-place epsi project"
# Set the working directory
WORKDIR /app

# Copy the application files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install concurrently

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Init prisma
RUN npx prisma generate

# Tell Docker about the port we'll run on.
EXPOSE 3000

# Command to run the server
CMD [ "node", "app.js" ]