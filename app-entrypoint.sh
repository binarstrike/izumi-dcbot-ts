#!/bin/sh

if [ ! -z $1 ]; then
    command=$1
    shift
    exec $command "$@"
elif [ ! -z $APP_WORKDIR ] && [ -d $APP_WORKDIR ]; then
    cd $APP_WORKDIR
    exec node ./dist/main.js
else
    echo "can't find app working directory"
    exit 1
fi