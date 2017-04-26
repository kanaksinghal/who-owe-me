const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const passwordHash = require('password-hash');

const entitySchema = new Schema({
	name: { type: String, required: [true, 'Name is required!'] },
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	linkTo: { type: Schema.Types.ObjectId, ref: 'User' },
	log: [
		new Schema({
			date: { type: Date, required: true },
			amount: { type: Number, required: true },
			remark: { type: String, maxlength: 180 }
		})
	],
	total: { type: Number, default: 0 },
	email: { type: String }
}, { strict: false, timestamps: true });

module.exports = mongoose.model('Entity', entitySchema);
