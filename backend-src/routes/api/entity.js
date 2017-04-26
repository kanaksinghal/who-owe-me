const express = require('express');
const userRoute = express.Router();

const Q = require('q');
const _ = require('underscore');

const Entity = require('../../models/entities.js');

userRoute.post('/save', (req, res, next) => {
	Q.fcall(() => {
		console.log(req.body)
		if(req.body.linkTo)
			User.find({ linkTo: req.body.linkTo }, "_id", { lean: true });
	})
	.then(linkUser => {
		var entity = {
			name: req.body.name,
			email: req.body.email,
			user: req.loggedInUser._id,
			linkTo: (linkUser||{})._id
		};

		if(req.body._id)
			return Entity.findOneAndUpdate(
				_.pick({ _id: req.body._id, user: entity.user }),
				{ $set: _.pick(entity, "name", "linkTo") },
				{ lean: true, new: true }
			)
		else
			return new Entity(entity).save({ lean: true });
	})
	.then(data => res.json(data))
	.catch(err => next(err));
})

userRoute.delete('/:id([0-9a-fA-F]{24})', (req, res, next) => {
	Q.fcall(() => {
		return Entity.findOneAndRemove({
			_id: req.params.id,
			user: req.loggedInUser._id
		});
	})
	.then(data => res.json(data))
	.catch(err => next(err));
})

userRoute.post('/log', (req, res, next) => {
	Q.fcall(() => {
		return Entity.findOneAndUpdate({
			_id: req.body._id,
			user: req.loggedInUser._id
		}, {
			$push: { log: _.pick(req.body, 'amount', 'date', 'remark') },
			$inc: { total: req.body.amount }
		}, {new: true, lean:true});
	})
	.then(data => res.json(data))
	.catch(err => next(err));
})

userRoute.get('/log/:id', (req, res, next) => {
	Q.fcall(() => {
		return Entity.findOne({
			_id: req.params.id,
			$or: [
				{ user: req.loggedInUser._id },
				{ linkTo: req.loggedInUser._id }
			]
		}, null, { lean: true });
	})
	.then(data => res.json(data))
	.catch(err => next(err));
})

userRoute.get('/my-list', (req, res, next) => {
	Q.fcall(() => {
		return Entity.find({
			user: req.loggedInUser._id
		}, "-log", { lean: true });
	})
	.then(data => {
		res.json(data);
	})
	.catch(err => next(err));
})

userRoute.get('/their-list', (req, res, next) => {
	Q.fcall(() => {
		return Entity.find({
			linkTo: req.loggedInUser._id
		}, "-log", { lean: true });
	})
	.then(data => {
		res.json(data);
	})
	.catch(err => next(err));
})

module.exports = { userRoute };
