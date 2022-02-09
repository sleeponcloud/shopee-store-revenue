FROM ubuntu:18.04
WORKDIR /build
MAINTAINER Walker Chen <walker@triplea-medtech.com>

USER root
ENV DEBIAN_FRONTEND "noninteractive"
RUN apt-get update && apt-get install -qy \
        curl \
        wget \
        git \
        gitk \
        joe \
        nano \
        sudo \
        docker.io && \
    curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get update && \
    apt-get install -qy --no-install-recommends \
        nodejs \
        yarn && \
    apt-get clean && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -g 1000 user && \
    useradd --shell "/bin/bash" --create-home -r -u 1000 -g user user && \
    echo "user ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    mkdir /home/user/.docker

COPY misc/.bashrc /home/user
COPY misc/init.sh /usr/bin

ENTRYPOINT ["/usr/bin/init.sh"]
