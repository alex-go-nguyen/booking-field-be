# GO2PLAY
A football venue booking web app

## Description

Backend REST full APIs build in NestJs framework

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
## File Structure
```bash
├── docker-compose.yml
├── docker.env
├── Dockerfile
├── ecosystem.config.js
├── nest-cli.json
├── ormconfig.ts
├── package.json
├── README.md
├── src
│   ├── app.module.ts
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.guard.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── dtos
│   │   │   ├── auth.response.dto.ts
│   │   │   ├── reset-password.dto.ts
│   │   │   └── signIn.payload.ts
│   │   └── roles.guard.ts
│   ├── booking
│   │   ├── booking.controller.ts
│   │   ├── booking.gateway.ts
│   │   ├── booking.module.ts
│   │   ├── booking.service.spec.ts
│   │   ├── booking.service.ts
│   │   ├── dtos
│   │   │   ├── booking-analyst-query.dto.ts
│   │   │   ├── booking-query.dto.ts
│   │   │   ├── create-booking.dto.ts
│   │   │   └── update-booking.dto.ts
│   │   └── entities
│   │       └── booking.entity.ts
│   ├── cloudinary
│   │   ├── cloudinary.controller.ts
│   │   ├── cloudinary.module.ts
│   │   ├── cloudinary.service.ts
│   │   └── interfaces
│   │       └── cloudinary-response.interface.ts
│   ├── common
│   │   ├── common.module.ts
│   │   ├── constants
│   │   │   └── index.ts
│   │   ├── decorators
│   │   │   ├── response-message.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── dtos
│   │   │   ├── base.dto.ts
│   │   │   ├── pagination.dto.ts
│   │   │   ├── query.dto.ts
│   │   │   └── sort.dto.ts
│   │   ├── entities
│   │   │   └── base.entity.ts
│   │   ├── enums
│   │   │   ├── order.enum.ts
│   │   │   └── role.enum.ts
│   │   ├── interceptors
│   │   │   └── transform.interceptor.ts
│   │   ├── interfaces
│   │   │   └── response.interface.ts
│   │   ├── services
│   │   │   └── base.service.ts
│   │   └── utils.ts
│   ├── database
│   │   ├── data
│   │   │   └── category.json
│   │   ├── database.module.ts
│   │   ├── factories
│   │   │   ├── pitch-category.factory.ts
│   │   │   ├── pitch.factory.ts
│   │   │   ├── user.factory.ts
│   │   │   └── venue.factory.ts
│   │   ├── migrations
│   │   │   ├── 1691039348322-UserMigration.ts
│   │   │   ├── 1691045889845-VenueMigration.ts
│   │   │   ├── 1691045902496-PitchMigration.ts
│   │   │   ├── 1691045913628-BookingMigration.ts
│   │   │   ├── 1691045934056-PitchCategoryMigration.ts
│   │   │   ├── 1691046028952-RatingMigration.ts
│   │   │   ├── 1692260542541-UpdateUserVenueFieldMigration.ts
│   │   │   ├── 1693292029745-ForgottenPasswordMigrations.ts
│   │   │   ├── 1693730806070-NotificationMigrations.ts
│   │   │   ├── 1694419561324-TournamentMigrations.ts
│   │   │   ├── 1694419561325-RoundMigrations.ts
│   │   │   ├── 1694419571341-TeamMigrations.ts
│   │   │   └── 1694419593287-MatchMigrations.ts
│   │   └── seeds
│   │       └── initial-seed.ts
│   ├── forgotten-password
│   │   ├── forgotten-password.module.ts
│   │   ├── forgotten-password.service.spec.ts
│   │   └── forgotten-password.service.ts
│   ├── main.ts
│   ├── match
│   │   ├── dto
│   │   │   ├── create-match.dto.ts
│   │   │   ├── match-query.dto.ts
│   │   │   └── update-match.dto.ts
│   │   ├── entities
│   │   │   └── match.entity.ts
│   │   ├── match.controller.ts
│   │   ├── match.module.ts
│   │   ├── match.service.spec.ts
│   │   └── match.service.ts
│   ├── notification
│   │   ├── dtos
│   │   │   ├── create-notification.dto.ts
│   │   │   ├── notification-query.dto.ts
│   │   │   └── update-notification.dto.ts
│   │   ├── entities
│   │   │   └── notification.entity.ts
│   │   ├── notification.controller.ts
│   │   ├── notification.module.ts
│   │   ├── notification.service.spec.ts
│   │   └── notification.service.ts
│   ├── pitch
│   │   ├── dtos
│   │   │   ├── create-pitch.dto.ts
│   │   │   ├── find-pitch.dto.ts
│   │   │   ├── pitch-query.dto.ts
│   │   │   └── update-pitch.dto.ts
│   │   ├── entities
│   │   │   └── pitch.entity.ts
│   │   ├── pitch.controller.ts
│   │   ├── pitch.module.ts
│   │   ├── pitch.service.spec.ts
│   │   └── pitch.service.ts
│   ├── pitch-category
│   │   ├── dtos
│   │   │   ├── create-pitch-category.dto.ts
│   │   │   ├── pitch-category-query.dto.ts
│   │   │   └── update-pitch-category.dto.ts
│   │   ├── entities
│   │   │   └── pitch-category.entity.ts
│   │   ├── pitch-category.controller.ts
│   │   ├── pitch-category.module.ts
│   │   ├── pitch-category.service.spec.ts
│   │   └── pitch-category.service.ts
│   ├── rating
│   │   ├── dtos
│   │   │   ├── create-rating.dto.ts
│   │   │   ├── rating-query.dto.ts
│   │   │   └── update-rating.dto.ts
│   │   ├── entities
│   │   │   └── rating.entity.ts
│   │   ├── rating.controller.ts
│   │   ├── rating.module.ts
│   │   ├── rating.service.spec.ts
│   │   └── rating.service.ts
│   ├── round
│   │   ├── dto
│   │   │   ├── create-round.dto.ts
│   │   │   ├── query.dto.ts
│   │   │   └── update-round.dto.ts
│   │   ├── entities
│   │   │   └── round.entity.ts
│   │   ├── round.controller.ts
│   │   ├── round.module.ts
│   │   ├── round.service.spec.ts
│   │   └── round.service.ts
│   ├── search
│   │   ├── search.module.ts
│   │   └── search.service.ts
│   ├── stripe
│   │   ├── dtos
│   │   │   └── create-payment-intent.dto.ts
│   │   ├── stripe.controller.ts
│   │   ├── stripe.module.ts
│   │   └── stripe.service.ts
│   ├── team
│   │   ├── dto
│   │   │   ├── create-team.dto.ts
│   │   │   ├── query.dto.ts
│   │   │   └── update-team.dto.ts
│   │   ├── entities
│   │   │   └── team.entity.ts
│   │   ├── team.controller.ts
│   │   ├── team.module.ts
│   │   ├── team.service.spec.ts
│   │   └── team.service.ts
│   ├── tournament
│   │   ├── dto
│   │   │   ├── create-tournament.dto.ts
│   │   │   └── update-tournament.dto.ts
│   │   ├── entities
│   │   │   └── tournament.entity.ts
│   │   ├── enums
│   │   │   └── tournament.enum.ts
│   │   ├── tournament.controller.ts
│   │   ├── tournament.module.ts
│   │   ├── tournament.service.spec.ts
│   │   └── tournament.service.ts
│   ├── user
│   │   ├── dtos
│   │   │   ├── analyst-user.dto.ts
│   │   │   ├── change-password.dto.ts
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-info-user.dto.ts
│   │   │   └── user-query.dto.ts
│   │   ├── entities
│   │   │   ├── forgotten-password.entity.ts
│   │   │   └── user.entity.ts
│   │   ├── user.controller.ts
│   │   ├── user.decorator.ts
│   │   ├── user.service.spec.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   └── venue
│       ├── dtos
│       │   ├── create-venue.dto.ts
│       │   ├── query-venue.dto.ts
│       │   ├── search-list-venue.dto.ts
│       │   └── update-venue.dto.ts
│       ├── entities
│       │   └── venue.entity.ts
│       ├── interfaces
│       │   ├── location.interface.ts
│       │   ├── venue-image.interface.ts
│       │   └── venue-search.interface.ts
│       ├── venue.controller.ts
│       ├── venue.module.ts
│       ├── venue.service.spec.ts
│       └── venue.service.ts
├── templates
│   └── resetPassword.ejs
├── test
│   └── jest-e2e.json
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```
## Architecture Diagram
![architecture-diagram](https://github.com/alex-go-nguyen/booking-field-be/assets/133078261/157bcb81-e3cf-4382-ad77-a7d9f09c4b24)

## Database Diagram
![mermaid-diagram-2023-09-20-151717](https://github.com/alex-go-nguyen/booking-field-be/assets/133078261/fcb47320-6afa-4efe-ae9b-7815ec8c9898)
