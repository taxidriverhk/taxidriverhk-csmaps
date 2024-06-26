FROM node:14

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .

RUN npm run build

EXPOSE 8090
ENV ADDRESS=0.0.0.0 PORT=8090

CMD ["npm", "start"]