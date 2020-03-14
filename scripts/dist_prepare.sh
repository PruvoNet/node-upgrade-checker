#!/usr/bin/env bash
cd src
find . -type f  \( -name '*.json' -o -name '*.js' -o -name '*.xml' -o -name '*.ejs'  -o -name '*.yml' -o -name '*.donotdeleteme' \) -exec cp --parents {} ../dist \;
