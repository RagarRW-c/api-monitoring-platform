.PHONY: help dev staging prod monitoring admin full clean logs ps

help: ## Pokaż pomoc
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Uruchom development
	docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml --env-file .env.dev up -d

staging: ## Uruchom staging
	docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml --env-file .env.staging up -d

prod: ## Uruchom production
	docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml --env-file .env.prod up -d

dev-monitoring: ## Dev + Monitoring
	docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml -f docker-compose.monitoring.yml --env-file .env.dev up -d

dev-admin: ## Dev + Admin Tools
	docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml -f docker-compose.admin.yml --env-file .env.dev up -d

dev-full: ## Dev + Monitoring + Admin
	docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml -f docker-compose.monitoring.yml -f docker-compose.admin.yml --env-file .env.dev up -d

stop: ## Zatrzymaj wszystko
	docker-compose down

clean: ## Wyczyść wszystko (z volumes!)
	docker-compose down -v
	docker system prune -f

logs: ## Zobacz logi
	docker-compose logs -f

logs-backend: ## Logi backend
	docker-compose logs -f backend

ps: ## Status kontenerów
	docker-compose ps

build: ## Przebuduj obrazy
	docker-compose build

rebuild: ## Rebuild bez cache
	docker-compose build --no-cache