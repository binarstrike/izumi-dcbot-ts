FROM node:18-alpine AS build

WORKDIR /temp/build

RUN corepack enable pnpm

COPY ./package.json ./pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store-cache,target=/root/.local/share/pnpm/store/v3 pnpm install --frozen-lockfile

COPY ./tsconfig.json ./
COPY ./prisma ./prisma
COPY ./src ./src
RUN <<EOF
    pnpm prisma generate
    pnpm build
    cp -rf src/generated dist/generated
EOF

FROM node:18-alpine

ENV APP_WORKDIR=/opt/izumiDcbot

WORKDIR ${APP_WORKDIR}

RUN corepack enable pnpm

COPY ./pnpm-lock.yaml ./package.json ./
RUN --mount=type=cache,id=pnpm-store-cache,target=/root/.local/share/pnpm/store/v3 \
    pnpm install --frozen-lockfile --prod --prefer-offline

COPY --chmod=700 ./app-entrypoint.sh /usr/local/bin/app-entrypoint.sh
COPY --from=build /temp/build/dist ./dist

ENTRYPOINT [ "app-entrypoint.sh" ]