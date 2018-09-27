#!/usr/bin/env sh

npm install --registry=https://registry.npm.taobao.org --global yarn

cd /usr/app/play-redis-demo

if [ ! -d "./node_modules" ]; then
    yarn install
fi

yarn start
