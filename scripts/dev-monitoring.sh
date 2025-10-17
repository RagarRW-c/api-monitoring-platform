#!/bin/bash
echo "🚀 Starting DEV with MONITORING..."
docker-compose -f docker-compose.base.yml \
               -f docker-compose.dev.yml \
               -f docker-compose.monitoring.yml \
               --env-file .env.dev "$@"
