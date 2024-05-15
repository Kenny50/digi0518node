# Use node.js version 20
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Install sequelize-cli globally
RUN npm install -g sequelize-cli

# Copy the rest of the application code to the working directory
COPY . .

# # Expose any ports the app is expecting in the Dockerfile
# EXPOSE 3000

# Command to run the application
# CMD ["npm", "start"]
CMD ["sh", "-c", "sequelize db:migrate && npm run dev"]
