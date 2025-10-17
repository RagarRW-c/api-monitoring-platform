cho "🏭 Starting PRODUCTION environment..."
docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml --env-file .env.prod "$@"