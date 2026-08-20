FROM debian:bookworm
USER root
RUN useradd -m -s /bin/bash roger

ADD . /home/roger/app

RUN apt update && apt upgrade -y
RUN apt install nodejs npm -y
RUN chmod 745 /home/roger/*

WORKDIR "/home/roger/app"

RUN npm i

RUN echo "" >  ./src/config/.env
RUN echo "PORT = 80" >> ./src/config/.env
RUN echo "HOST = localhost" >> ./src/config/.env
RUN echo "DB_USERNAME = dbadmin" >> ./src/config/.env
RUN echo "PASSWORD = super_secure_password" >> ./src/config/.env
RUN echo "DATABASE = postgres" >> ./src/config/.env
RUN echo "DB_PORT = 5432" >> ./src/config/.env
RUN echo "DB_HOST = 127.0.0.1" >> ./src/config/.env
RUN echo "SESSION_SECRET = somethingsomething" >> ./src/config/.env
RUN echo "EMAIL = null" >> ./src/config/.env
RUN echo "EMAIL_PROVIDER = gmail" >> ./src/config/.env
RUN echo "EMAIL_PASSWORD = null" >> ./src/config/.env
RUN echo "JWT_SECRET = minecraft" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_1 = rogerroger1@gmail.com" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_2 = rogerroger2@gmail.com" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_3 = rogerroger3@gmail.com" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_4 = rogerroger4@gmail.com" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_5 = rogerroger5@gmail.com" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_6 = rogerroger6@gmail.com" >> ./src/config/.env
RUN echo "EXMAPLE_EMAIL_7 = rogerroger7@gmail.com" >> ./src/config/.env

USER roger

ENTRYPOINT node /home/roger/app/index.js
