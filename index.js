const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');
const databaseConfig = require('./config/database');

// Load environment variables from .env file
dotenv.load();

databaseConfig();

const app = express();
expressConfig(app);
routesConfig(app);

app.listen(app.get('port'));

console.log('%s Home server listening on port %d in %s mode.', chalk.green('✓'), app.get('port'), app.get('env'));
