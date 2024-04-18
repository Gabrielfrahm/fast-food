# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn

# Bundle app source
COPY . .

# Bind mount your source into the container
VOLUME [ "/usr/src/app" ]

# Expose the port the app runs on
EXPOSE 3333

# Run the application in development mode with hot reload
CMD ["yarn", "start:dev"]