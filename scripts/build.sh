#!/usr/bin/env bash
set -x
set -e
npm run lint
rm -rf ./dist/*
./scripts/dist_prepare.sh
./node_modules/.bin/tsc
