require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
var morgan = require('morgan');
const errorHandler = require('./middleware/error-handler');

// To use environment variables
require('dotenv').config({
	path: path.resolve(
		__dirname,
		process.env.NODE_ENV
			? `../${process.env.NODE_ENV}.env`
			: '../.env'
	),
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(
	cors({
		origin: (origin, callback) => callback(null, true),
		credentials: true,
	})
);
app.use(
	morgan('dev', {
		skip: (req, res) => process.env.NODE_ENV === 'test',
	})
);

// api routes
app.use('/accounts', require('./routes/account.routes'));
app.use('/walkers', require('./routes/walker.routes'));

// global error handler
app.use(errorHandler);

// start server
const port =
	process.env.NODE_ENV === 'production'
		? process.env.PORT || 80
		: 4000;
const server = app.listen(port, () => {
	console.log('Server listening on port ' + port);
});

module.exports = {
	app,
	server,
};
