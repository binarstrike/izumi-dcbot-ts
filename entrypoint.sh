#!/bin/bash
if [ ! -z $1 ]; then
    command=$1
    shift
    $command "$@"
else
    WORKDIR=/bot
    MAIN_SCRIPT=$WORKDIR/dist/index.js
    cd $WORKDIR
    printf "Starting Discord Bot Chat GPT...\n"
    sleep 2
    # apply migration to database
    yarn prisma:deploy
    if test "$NODE_ENV" == "development"; then
        MAIN_SCRIPT=$WORKDIR/src/index.ts
        yarn start:dev
    else
        pm2-docker $MAIN_SCRIPT
    fi
fi