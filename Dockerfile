# FROM ubuntu:18.04
FROM node:latest

COPY . ./app

WORKDIR /app/src

# RUN apt-get update

# RUN apt install -y nodejs

# RUN apt install -y npm

# RUN apt install -y curl

# RUN npm i -g n

# RUN npm i -g yarn

# RUN n 14

# RUN yarn add typescript tsc ts-node nodemon

RUN yarn install

EXPOSE 8000

CMD ["yarn", "start"]

