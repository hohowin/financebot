FROM node:18.4.0-alpine

ENV TIME_ZONE="America/New_York" \
    ENV_NAME=production \
    NODE_ENV=production \
    NODE_CONFIG_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

USER node

# Port 4001 should be removed when mock server is no longer needed
EXPOSE 3000

ENTRYPOINT ["node"]
CMD ["server.js"]