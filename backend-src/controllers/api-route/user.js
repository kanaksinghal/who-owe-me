const express = require('express');
const guestRoute = express.Router();
const userRoute = express.Router();

const validator = require('validator');
const passwordHash = require('password-hash');
const Q = require('q');
const _ = require('underscore');

const User = require('../../models/users.js');

guestRoute.post('/register', (req, res, next) => {
	const user = req.body.user;

	Q.fcall(() => {
		if(!user.password || user.password.length < 6)
			throw new Error("Password is required and must be at least 6 character long.");

		user.token = [{
			ua: req.headers['user-agent']
		}]
		return new User(user).save({ lean: true });
	})
	.then(user => {
		let data = _.omit(user.toObject(), 'password');
		data.token = data.token[0];
		return res.json(data);
	})
	.catch(err => next(err));
});

guestRoute.post('/login', (req, res, next) => {
	Q.fcall(() => {
		if(!req.body.password || !req.body.username)
			throw new Error("password & username are required.");
		else if(req.body.password.length < 6)
			throw new Error("Password must be at least 6 character long.");

		return User.findOne({ username: req.body.username.trim().toLowerCase() }, null, { lean: true })
	})
	.then(user => {
		if(!user || !passwordHash.verify(req.body.password, user.password))
			throw new Error("Invalid username and/or password!");

		return User.findByIdAndUpdate(user._id, {
			$push: { token: { ua: req.headers['user-agent'] } }
		}, { new: true, lean: true })
	})
	.then(user => {
		user.token = _.last(user.token);
		res.json(_.omit(user, 'password'));
	})
	.catch(err => next(err));
})

userRoute.get('/logout', (req, res, next) => {
	Q.fcall(() => {
		return User.findByIdAndUpdate(req.loggedInUser._id, {
			$pull: {
				token: {
					_id: req.headers['authorization'],
					ua: req.headers['user-agent']
				}
			}
		}, { new: true, lean: true })
	})
	.then(user => {
		res.json({ success: true });
	})
	.catch(err => next(err));
})

module.exports = { guestRoute, userRoute };
