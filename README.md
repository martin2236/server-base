
## VARIABLES DE ENTORNO ACEPTADAS

"development" || "test" || "production"

## BAJAR EL CONTENEDOR

docker compose down

## SUBIR EL CONTENEDOR

docker-compose up --build 

## EJECUTAR COMANDOS SEQUELIZE

docker exec -it portfolio-back npx sequelize-cli db:seed:undo:all   
docker exec -it portfolio-back npx sequelize-cli db:migrate:undo:all 
docker exec -it portfolio-back npx sequelize-cli db:migrate 
docker exec -it portfolio-back npx sequelize-cli db:seed:all

