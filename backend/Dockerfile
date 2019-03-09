FROM node:10 

ENV DEBIAN_FRONTEND noninteractive

RUN npm install -g yarn 

WORKDIR /app

COPY ./yarn.lock /app
COPY ./package.json /app
RUN yarn install 

COPY . /app

EXPOSE 5000

CMD ["yarn", "start"] 
