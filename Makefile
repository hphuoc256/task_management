build:
	docker compose build --no-cache --force-rm

up:
	docker compose up -d

down:
	docker compose down --remove-orphans

stop:
	docker compose stop

restart:
	@make down
	@make up


adonis-app:
	docker exec -it adonis_app_management bash

adonis-dev:
	docker exec -it adonis_app_management npm run dev
