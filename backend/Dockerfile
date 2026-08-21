FROM debian:bookworm

USER root
RUN useradd -m -s /bin/bash roger
RUN apt update && apt upgrade -y
RUN apt install nodejs npm -y

ADD . /home/roger/app
WORKDIR "/home/roger/app"
RUN chown roger /home/roger/*
RUN npm i

RUN echo "" >  ./src/config/.env
RUN echo "PORT=${PORT}" >> ./src/config/.env
RUN echo "HOST=${HOST}" >> ./src/config/.env
RUN echo "DB_USERNAME=${DB_USERNAME}" >> ./src/config/.env
RUN echo "PASSWORD=${PASSWORD}" >> ./src/config/.env
RUN echo "DATABASE=${DATABASE}" >> ./src/config/.env
RUN echo "DB_PORT=${DB_PORT}" >> ./src/config/.env
RUN echo "DB_HOST=${DB_HOST}" >> ./src/config/.env
RUN echo "SESSION_SECRET=${SESSION_SECRET}" >> ./src/config/.env
RUN echo "EMAIL=${EMAIL}" >> ./src/config/.env
RUN echo "EMAIL_PROVIDER=${EMAIL_PROVIDER}" >> ./src/config/.env
RUN echo "EMAIL_PASSWORD=${EMAIL_PASSWORD}" >> ./src/config/.env
RUN echo "JWT_SECRET=${JWT_SECRET}" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_1=${EXAMPLE_EMAIL_1}" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_2=${EXAMPLE_EMAIL_2}" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_3=${EXAMPLE_EMAIL_3}" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_4=${EXAMPLE_EMAIL_4}" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_5=${EXAMPLE_EMAIL_5}" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_6=${EXAMPLE_EMAIL_6}" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_7=${EXAMPLE_EMAIL_7}" >> ./src/config/.env

ENTRYPOINT node /home/roger/app/index.js
