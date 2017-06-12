#!/bin/bash
yarn test
./node_modules/eslint/bin/eslint.js src
