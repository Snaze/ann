#!/usr/bin/env bash

./node_modules/babel-cli/bin/babel.js src --out-dir lib --plugins transform-class-properties --presets=es2015,react