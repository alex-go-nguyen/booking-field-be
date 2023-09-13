FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn
# Development
CMD ["npm", "run", "start:dev"]

# Production
# RUN npm install -g @nestjs/cli pm2

# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
EXPOSE 3000