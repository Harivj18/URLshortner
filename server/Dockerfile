FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Create logs directory for volume mount
RUN mkdir -p /app/logs

EXPOSE 8080

CMD ["npm", "start"]
