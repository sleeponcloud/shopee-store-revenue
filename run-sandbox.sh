#!/bin/bash

enterSandboxMsg() {
    echo -e "================="
    echo -e "\033[1;33mSandbox by Docker\033[0m"
    echo -e "================="
}

exitSandboxMsg() {
    echo -e "================="
    echo -e "\033[1;33mExit Sandbox\033[0m"
    echo -e "================="
}

runSandbox() {
DOCKER_CONFIG_FILE="$HOME/.docker"
DOCKER_DIR_MAPPING=""
if [ -d "$DOCKER_CONFIG_FILE" ]; then
    DOCKER_DIR_MAPPING="-v $HOME/.docker/config.json:/home/user/.docker/config.json"
fi
GIT_CONFIG_FILE="$HOME/.gitconfig"
GIT_CONFIG_MAPPING=""
if [ -f "$GIT_CONFIG_FILE" ]; then
    GIT_CONFIG_MAPPING="-v $HOME/.gitconfig:/home/user/.gitconfig:ro"
fi

docker run \
    -u root \
    -it \
    --rm \
    --network host \
    --env USER_ID=$(id -u) \
    --env GROUP_ID=$(id -g) \
    -v $(pwd):/build \
    $GIT_CONFIG_MAPPING \
    $DOCKER_DIR_MAPPING \
    -v /etc/localtime:/etc/localtime:ro \
    -v /var/run/docker.sock:/var/run/docker.sock \
    192.168.1.30:5000/cracker:latest
}

enterSandboxMsg
runSandbox
exitSandboxMsg
