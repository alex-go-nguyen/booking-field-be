FROM node:18-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN yarn

COPY . /usr/src/app

CMD ["npm", "run", "start:dev"]

# Production
# RUN npm install -g @nestjs/cli pm2


# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
EXPOSE 3000