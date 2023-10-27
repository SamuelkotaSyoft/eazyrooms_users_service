FROM node:18

WORKDIR /usr/src/eazyrooms_user_service

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3001

CMD ["node", "server.js"]