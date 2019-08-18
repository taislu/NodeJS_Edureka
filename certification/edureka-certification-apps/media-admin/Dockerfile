
#FROM node:10
FROM node:alpine

# Create app directory in the container
WORKDIR /usr/src/app

# Copy files to the working directory in the container
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Copy everything to thr container
COPY . .

# PORT definded in app.js 
EXPOSE 9900

# node app.js
CMD [ "npm", "start" ]