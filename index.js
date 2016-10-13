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

console.log(chalk.bold(`${chalk.green('✓')} Server listening on port ${app.get('port')} in ${app.get('env')} mode.`));
