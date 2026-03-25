FROM postgres:16

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    postgresql-plpython3-16 \
    jq \
    && rm -rf /var/lib/apt/lists/* \
