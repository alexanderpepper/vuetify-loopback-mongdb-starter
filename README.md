# vuetify-loopback-mongodb

## Code style
This project uses [JavaScript Standard Style](https://github.com/standard/standard), enforced (so far only in the front end) by [ESLint](https://eslint.org/).

Use of ES6+ features in this project is encouraged.

## Tech/framework used

- [MongoDB](https://www.mongodb.com/)
- [Loopback](https://loopback.io/)
- [PM2](http://pm2.keymetrics.io/)
- [webpack](https://webpack.js.org/)
- [ESLint](https://eslint.org/)
- [SuperAgent](https://visionmedia.github.io/superagent/)
- [VueJS](https://vuejs.org/)
- [Vuetify](https://vuetifyjs.com/en/)

## Prequisites
* MongoDB
* NodeJS
* PM2 (for production deployment)

## Installation

Clone the repository
```bash
git clone https://github.com/alexanderpepper/vuetify-loopback-mongodb.git;
```

Install NPM packages
```bash
cd vuetify-loopback-mongodb
npm install
cd client
npm install
```

## Configuration

### Configure Application
* Create `/server/constants/credentials.js` with the following content:
```javascript
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  clientSecret: '<your_client_secret>',
  clientId: '<your_client_id>',
  redirectUri: isProd ? 'https://yoursite.com/callback' : 'http://localhost:8080/callback'
}
```
## Development
Running the server and client as separate processes gives the best development experience with hot reloading in the client app.

The client app is
* Configured in `client/.env.development` to use `http://localhost:3000/api` as the base API path when running in development
* Configured in `client//.env.production` to use `/api` as the base API path when built for production

## Running the Server in Development
To run the Loopback server in devepment mode on `https://localhost:3000`:
```bash
node .
```
Loopback uses swagger to document the server's REST API. This can be viewed at `http://localhost:3000/explorer`

## Running the Client in Development
To run the Vue client in development mode on `http://localhost:8080`
```bash
cd client
npm run dev
```

## Preparing for Deployment
Acquire a standalone certificate from [LetsEncrypt](https://letsencrypt.org/) and create `server/ssl-config.js` with the following content:

```javascript
const path = require('path')
const fs = require('fs')
const isProd = process.env.NODE_ENV === 'production'

exports.privateKey = isProd ? fs.readFileSync(path.join('/path/to/privkey.pem')).toString() : ''
exports.certificate = isProd ? fs.readFileSync(path.join('/path/to/cert.pem')).toString() : ''
exports.chain = isProd ? fs.readFileSync(path.join('/path/to/chain.pem')).toString() : ''
exports.fullchain = isProd ? fs.readFileSync(path.join('/path/to/fullchain.pem')).toString() : ''
```

## Deploying for Production

When the server starts, `/server/boot/client.js` builds the client app by running `npm run build`  in the `client` folder.

To start the server
```bash
node_modules/pm2/bin/pm2 start pm2.json --env production
```

To stop the server
```bash
node_modules/pm2/bin/pm2 kill
```

To monitor the server
```bash
node_modules/pm2/bin/pm2 monit
```

## License
MIT © 2018 [Alex Pepper](https://alexpepper.us)
