start:
	docker-compose up -d --build

stop:
	-docker stop $$(docker ps -q)             
	-docker rm -f $$(docker ps -aq)           
	-docker rmi -f $$(docker images -q)
	-docker image prune -f

.PHONY: start stop
