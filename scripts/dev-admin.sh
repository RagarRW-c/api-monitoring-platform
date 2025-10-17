#!/bin/bash
echo "🚀 Starting DEV with ADMIN TOOLS..."
docker-compose -f docker-compose.base.yml \
               -f docker-compose.dev.yml \
               -f docker-compose.admin.yml \
               --env-file .env.dev "$@"
