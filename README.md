# Booking Football Pitch

A football booking pitch website

## Description

Backend app building with nestjs framework

## Presequite

#### Yarn

```
$ npm install -g yarn
```

## Installation

```bash
$ yarn install
```

## Environment variables

#### Create .env file:

```
$ nano .env
```

#### .env

```
NODE_ENV=
JWT_SECRET_KEY=
EXPIRESIN=
PORT=

DB_TYPE=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=

ELASTIC_SEARCH_PORT=
ELASTIC_NODE=

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Note: Please ask another dev to get access to the env vars in these files.

## Running the app

```
Start Docker: docker compose up
```

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Jest Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
