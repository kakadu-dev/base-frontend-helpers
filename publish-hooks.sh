#!/usr/bin/env bash

REVERT=$1

# Universal sed function (linux and macos)
function universalSed() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i "" "$1" "$2"
    else
        sed -i "$1" "$2"
    fi
}

if [[ "$REVERT" != "revert" ]]; then
    universalSed "s#src/index.js#lib/index.js#g" package.json
else
    universalSed "s#lib/index.js#src/index.js#g" package.json
fi
