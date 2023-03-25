FROM node:18-slim AS build

WORKDIR /build

COPY . /build

RUN yarn && yarn build:ts

FROM node:18-slim

WORKDIR /bot

COPY --from=build /build/dist /bot/dist

COPY ./prisma ./yarn.lock ./package.json ./

COPY ./entrypoint.sh /entrypoint.sh

RUN yarn --prod && \
yarn prisma:generate && \
yarn global add pm2

RUN yarn cache clean

ENTRYPOINT [ "/bin/bash", "/entrypoint.sh" ]