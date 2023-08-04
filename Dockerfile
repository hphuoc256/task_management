# Use the official Node.js 18 image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Expose the port on which the AdonisJS application will run
EXPOSE 9229

# Start the AdonisJS application in development mode
#CMD ["npm", "run", "dev"]
