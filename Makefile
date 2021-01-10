VERSION = $(shell cat package.json | jq .version -r)
NAME = $(shell cat package.json | jq .name -r)

.build_docker:
	docker build -f Dockerfile.build -t $(NAME)_build:$(VERSION) . 
	touch $@

game/game.js: .build_docker
	docker run -it --rm -v $(shell pwd):/app -u $(shell id -u):$(shell id -g) $(NAME)_build:$(VERSION)

.PHONY: deploy
deploy: game/game.js
	docker run -d -v $(shell pwd):/var/www:ro -u $(shell id -u):$(shell id -g) -p 8080:8080 trinitronx/python-simplehttpserver

.PHONY: clean
clean:
	rm .build_docker game/game.js
