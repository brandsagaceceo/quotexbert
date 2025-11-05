#!/bin/bash
# Custom build script for Vercel that skips linting
export SKIP_ENV_VALIDATION=1
export DISABLE_ESLINT_PLUGIN=true
npx next build --no-lint 2>&1 || npx next build 2>&1
