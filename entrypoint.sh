#!/bin/bash
if [ ! -z $1 ]; then
    command=$1
    shift
    $command "$@"
else
    WORKDIR=/bot
    MAIN_SCRIPT=$WORKDIR/dist/index.js
    cd $WORKDIR
    echo "Starting Discord Bot Chat GPT..."
    sleep 2
    # apply migration to database
    yarn prisma:deploy
    
    pm2-docker $MAIN_SCRIPT
fi