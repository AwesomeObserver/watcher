FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD . .

RUN yarn
RUN yarn build

CMD ["yarn", "start"]