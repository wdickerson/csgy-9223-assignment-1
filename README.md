# CSGY 9223 Question and Answer assignment

A question and answer site called "Qoissant."
The frontend is built with `create-react-app` within the `qoissant` directory.
The backend is built with AWS API Gateway and Lambda.
The API definition is developed with Swagger and saved in the OpenAPI 3 standard.

## Frontend Development

Prerequisites: Node >= 14.x.x and NPM >= 5.x.x

### Install dependencies

From the `qoissant` directory, `npm install`

### Compile with live reload

From the `qoissant` directory, `npm start`

### Run the tests

From the `qoissant` directory, `npm test`

### Build for production

From the `qoissant` directory, `npm run build`

### Deploy

For now the build directory is copied to an AWS S3 bucket configured to host a static site.

## API Definition

`qoissant-api-openapi3.yaml` defines the API. It has been imported into API Gateway.

## Server

The server is implemented via Lambda functions. Those definitions are in the `lambdas` directory. Currently, only one function is implemented (and it returns dummy data). 

