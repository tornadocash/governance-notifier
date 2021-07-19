FROM node:12-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN yarn && yarn cache clean --all
COPY . /usr/src/app

CMD ["yarn", "start"]