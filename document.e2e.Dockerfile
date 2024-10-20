FROM node:20.17.0-alpine

RUN apk add --no-cache bash
RUN npm i -g pnpm @nestjs/cli typescript ts-node

COPY package*.json pnpm-lock.yaml /tmp/app/
RUN cd /tmp/app && pnpm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.document.ci.sh /opt/startup.document.ci.sh
RUN chmod +x /opt/startup.document.ci.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.document.ci.sh

WORKDIR /usr/src/app
RUN echo "" > .env
RUN pnpm run build

CMD ["/opt/startup.document.ci.sh"]
