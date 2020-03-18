#!/usr/bin/env bash
set -x
set -e
yarn run lint
rm -rf ./dist/*
./node_modules/.bin/tsc
