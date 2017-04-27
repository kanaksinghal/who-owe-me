require('dotenv').config();
const express = require('express');
const gzipStatic = require("connect-gzip-static");
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('underscore');
const Q = require('q');
const fs = require('fs');

const app = express();
const apiApp = express();
const apiAuthApp = express();

// Mongo connection init
mongoose.Promise = Q.Promise;
mongoose.connect(process.env['MONGO_URI']);

app.use(favicon(path.join(__dirname, '..', 'dist', 'meta', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(gzipStatic(path.join(__dirname, '..', 'dist'), { maxAge: 365*24*60*60*1000 }));

apiAuthApp.use(require('./controllers/auth'))

const API_DIR = path.join(__dirname, 'controllers/api-route');
Q.nfcall(fs.readdir, API_DIR).then((files) => {
	return files.map(file => {
		return file.endsWith(".js")?file.replace(/\.js$/, ''):null
	})
	.filter(file => {
		return file !== null;
	});
})
.then(files => {
	files.forEach(file => {
		let route = require(path.join(API_DIR, file));
		if(route.userRoute)
			apiAuthApp.use('/' + file, route.userRoute)
		if(route.guestRoute)
			apiApp.use('/' + file, route.guestRoute)
		if(!route.guestRoute && !route.userRoute)
			apiApp.use('/' + file, route)
	})
})
.then(() => {
	app.use('/api', apiApp);
	app.use('/api', apiAuthApp);
})
.then(() => {
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handler
	app.use(function(err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? _.pick(err, 'message', 'stack', 'errors') : {};

		// render the error page
		res.status(err.status || 500);
		res.json({ success: false, data: res.locals });
	});
	console.log("Server Started!");
})
.catch(err => {
	console.log("Error startig server!");
	console.log(err);
})

module.exports = app;
