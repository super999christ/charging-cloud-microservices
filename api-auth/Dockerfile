FROM --platform=linux/amd64 node:18-alpine

WORKDIR /apps/api-auth

COPY . .

RUN touch .env

RUN npm i

RUN npm install -g @nestjs/cli typescript

RUN npm run tsc

RUN npm run build

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV NO_COLOR=true

CMD npm run dev