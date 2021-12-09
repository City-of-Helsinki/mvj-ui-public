FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN node --version
RUN apk update
RUN apk add python3
RUN npm rebuild node-sass
RUN yarn install && yarn cache clean --force

COPY . .

VOLUME [ "/app" ]

CMD ["yarn", "start"]
