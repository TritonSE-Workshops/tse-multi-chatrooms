FROM node:10

ENV DEBIAN_FRONTEND noninteractive
ENV PORT 80

RUN npm install -g yarn 

WORKDIR /app

COPY ./yarn.lock /app
COPY ./package.json /app
RUN yarn install 

COPY . /app

EXPOSE 80

CMD ["yarn", "start"]
