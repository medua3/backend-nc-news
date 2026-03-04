# NC News API

NC News is a RESTful API that provides access to a news database containing articles, topics, users, and comments. It allows clients to retrieve, create, update and delete data related to articles and their associated comments.

This project was built using Node.js, Express, Jest, Supertest, PostgreSQL and Render (deployment) follows the MVC (Model–View–Controller) architecture.

# Cloning the Repository
To clone the Reposiory the following command is used : 
git clone https://github.com/medua3/backend-nc-news

# Installing Dependencies
Running npm install installs all required packages

# Environment Variables
You will need to create two .env files in the root of the project:
.env.test 
.env.development 
With the following added for each .env file :
PGDATABASE=nc_news for .env.development 
PGDATABASE=nc_news_test for .env.test 

 # Setting up the Local Database
Create the databases:
npm run setup-dbs
Seed the development database:
npm run seed

# Running the Server Locally
Start the server:
npm start
The server will run at:
http://localhost:9090/api

# Running Tests
Run the test suite using:
npm test
The tests verify that all API endpoints respond with the correct data and status codes using Jest and Supertest.

# Minimum Version Requirements
Minimum recommended versions:
Node.js: v18.0.0
PostgreSQL: v14.0   