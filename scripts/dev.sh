echo "🚀 Starting DEVELOPMENT environment..."
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml --env-file .env.dev "$@"