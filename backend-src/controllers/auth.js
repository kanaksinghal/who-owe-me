const User = require('../models/users');

module.exports = (req, res, next) => {
	User.findOne({
		_id: req.headers['id'],
		"token._id": req.headers['authorization'],
		"token.ua": req.headers['user-agent']
	})
	.then(user => {
		if(!user)
			throw new Error("Unauthorized request");
		req.loggedInUser = user;
		next();
	})
	.catch(err => {
		err.status = 401;
		next(err);
	})
}
