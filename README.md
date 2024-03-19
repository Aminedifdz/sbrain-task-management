# Task Management App with NestJS, Prisma ORM, and Docker

## Overview

This application is a Task Management System developed using NestJS, a progressive Node.js framework for building efficient and scalable server-side applications. It leverages Prisma ORM for database operations and Docker for containerization, ensuring a consistent development environment and easy deployment. The system features a comprehensive task management module and a user system with JWT authentication, including refresh tokens for enhanced security.

## Features

- **Task Management:** Users can perform all CRUD operations on tasks through endpoints prefixed with `/api/v1/tasks`.

- **User System:** A complete user system supporting CRUD operations. It integrates JWT authentication, including access and refresh tokens, to securely manage user sessions.

- **Testing:** The application includes tests for the task retrieval functionality, implemented using Jest.



## Getting Started

### Prerequisites

- Docker
- Docker Compose



### Setting Up and Running with Docker

1. **Clone the repository:**
   ```bash

   git clone https://github.com/Aminedifdz/sbrain-task-management

   cd sbrain-task-management


### Build and run the application using Docker Compose in development mode :

docker-compose -f docker-compose-dev.yml up

or :    yarn docker:start:dev

stop by :    yarn docker:stop:dev



### Build and run the application using Docker Compose in production mode :

docker-compose -f docker-compose.yml up

or :    yarn docker:start:prod

stop by :    yarn docker:stop:prod



This command builds the application container and starts the services defined in your docker-compose.yml file.



##  API Endpoints

### AUTH

###### Register User: 
POST /api/v1/auth/signup

###### Login: 
POST /api/v1/auth/signin

###### Refresh Token: 
POST /api/v1/users/refreshToken

###### Revoke Refresh Token: 
DELETE /auth/refreshToken


### Users

###### Get Users: 
GET /api/v1/users

###### Get One User: 
GET /api/v1/users/:id

###### Update User: 
PATSH /api/v1/users/:id

###### Delete User: 
DELETE /api/v1/users/:id

###### Verify User: 
GET /users/verify/verifyToken

###### Get Profile : 
GET /users/me

###### Ask for User Reset Password: 
POST /users/forgot_password

###### User Reset Password: 
POST /api/v1/users/reset_password


### Tasks

###### Create Task: 
POST /api/v1/tasks

###### Get Tasks:   (with offset base pagination)
GET /api/v1/tasks

###### Get Tasks:  (another enpoint as get tasks but with cursor base pagination)
GET /api/v1/tasks/all

###### Get Task by ID: 
GET /api/v1/tasks/:id

###### Update Task: 
PATSH /api/v1/tasks/:id

###### Delete Task: 
DELETE /api/v1/tasks/:id



### Accessing Documentation

###### Get Docs: 
GET /api/v1/docs




### Run the API in development mode

```javascript
yarn 
yarn db:dev:restart     "to clean up the existing db and deploy the new one"
yarn start:dev 

```

### Run the API in production mode mode


##### 1. yarn prisma:dev:deploy

```javascript
yarn 
yarn start:prod 
```

###  Accessing the Application

After starting the application, it will be accessible at http://localhost:5000.



### Running Tests

To run the tests for the api with Yarn and after launching up the database, execute the following commands :

#### a. e2e

##### 1. yarn prisma:test:deploy    (first, and when the dev db is up)
##### 2. yarn pretest:e2e
##### 3. yarn test:e2e

#### b. unit

##### 3. yarn test:unit
