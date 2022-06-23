DOCKER_COMPOSE_FILE_BASE=docker/docker-compose-ipfs-node.yaml
DOCKER_COMPOSE_FILE="-f ${DOCKER_COMPOSE_FILE_BASE}"

SEQUENCE=$(seq 0 8)
for i in $SEQUENCE
do
    mkdir ~/Downloads/data${i}
    mkdir ~/Downloads/stage${i}
done

# docker deploy --compose-file ./docker/docker-compose-ipfs-node.yaml
docker-compose ${DOCKER_COMPOSE_FILE} up -d