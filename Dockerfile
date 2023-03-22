FROM node:18-slim AS build

WORKDIR /build

COPY . /build

RUN yarn --no-lockfile && yarn build:ts

FROM build AS final

WORKDIR /bot

COPY --from=build /build/dist /bot/dist

RUN rm -rvf /build

COPY ./prisma ./package.json ./

COPY ./entrypoint.sh /entrypoint.sh

RUN yarn --no-lockfile --prod && \
yarn prisma:generate && \
yarn global add pm2 && \
yarn cache clean

ENTRYPOINT [ "/bin/bash", "/entrypoint.sh" ]