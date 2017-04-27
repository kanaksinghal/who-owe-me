const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const passwordHash = require('password-hash');

const userSchema = new Schema({
	name: { type: String, required: [true, 'Name is required!'] },
	username: {
		type: String,
		required: [true, 'Username is required!'],
		validate: {
			validator: function (v) {
				return validator.isEmail(v);
				// return /^[a-z0-9]{6,20}$/.test(v);
			},
			message: 'Invalid email!'
		},
		set: function (v) {
			return v.toLowerCase();
		},
		unique: true
	},
	password: {
		type: String,
		required: [true, 'Password is required!'],
		set: function(v) {
			return passwordHash.generate(v);
		}
	},
	token: [
		new Schema({
			ua: String
		}, { timestamps: true })
	]
}, { strict: false, timestamps: true });

module.exports = mongoose.model('User', userSchema);
