
# Fastify API Starter - Typescript / Clean Architecture

## Description
Minimalist boilerplate for fastify API with Typescript and Clean Architecture that I use for small side projects.
No database (JSON file used as database), no authentication, no authorization, no validation (only Typia is used), no complicated  stuff. Just a simple API.

However, it is easy to add any of these features by following the same architecture.

## Why

- I just need a simple API with a simple architecture that I can easily extend or move to another project.
- It's boring to set up the same things over and over again.
- A good way to check if I can wrapping up all these libraries in a simple and clean way.


## What's included

- [Fastify](https://www.fastify.io/) - Fast and low overhead web router for Node.js.
- [Typescript](https://www.typescriptlang.org/) - Typed superset of JavaScript that compiles to plain JavaScript.
- [Awilix](https://github.com/jeffijoe/awilix) - Dependency injection container. Configured to work with Fastify.
- [Typia](https://typia.io) - Typescript runtime type checking library.
- [VineJs](https://vinejs.dev/docs/introduction) - Validation library for Http requests. Configured to work with Fastify.
- [Vitest](https://vitest.dev/) - Test runner. Configured to run transformed code with Typia
- [Cucumber](https://cucumber.io/) - BDD testing framework (useful for doing wishful programming).

## Getting started

### Run the docker container

```bash
docker-compose up
```

### Run unit tests

```bash
docker compose run --rm api pnpm unit
```

### Run integration tests

```bash
docker compose run --rm api pnpm integration
```

### Run feature tests

```bash
docker compose run --rm api pnpm features
```

### Routes

- GET `/hello` - Return a hello world message.
- POST `/todo` - Create a todo. => `{ "name": "My todo" , status: "todo" }`
- GET `/todo`  - Get all todos.


### How implement things and features

There are basic things implemented in this boilerplate. You can use them as a reference to implement your own features.