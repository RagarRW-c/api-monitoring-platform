echo "🔧 Starting STAGING environment..."
docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml --env-file .env.staging "$@"