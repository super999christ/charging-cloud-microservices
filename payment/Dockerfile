FROM --platform=linux/amd64 node:18-alpine

WORKDIR /apps/payment

COPY . .

RUN touch .env

RUN npm i

RUN npm install -g @nestjs/cli

RUN npm run build


EXPOSE 3000

CMD npm run start