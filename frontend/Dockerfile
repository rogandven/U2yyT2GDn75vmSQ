FROM debian:bookworm

USER root
RUN useradd -m -s /bin/bash roger
RUN apt update && apt upgrade -y
RUN apt install nodejs npm nginx -y

ADD . /home/roger/app
WORKDIR "/home/roger/app"
RUN chown roger /home/roger/*
RUN npm i

RUN echo "" >  .env
RUN echo "API_URL=${API_URL}:${API_PORT}" >> .env
RUN echo "VITE_API_URL=${API_URL}:${API_PORT}" >> .env

RUN npm run build

RUN (rm -rf /var/www/html/*) && (cp ./dist/* /var/www/html -r)

STOPSIGNAL SIGQUIT

WORKDIR "/"
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]