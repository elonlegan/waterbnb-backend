const roomService = require('../services/walker.service');
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');

module.exports = {
	getAll,
	getById,
	askForVerification,
	verifyWalker,
};

function getAll(req, res, next) {
	roomService
		.getAll()
		.then((walkers) => res.json(walkers))
		.catch(next);
}

function getById(req, res, next) {
	roomService
		.getById(req.params.id)
		.then((walker) =>
			walker ? res.json(walker) : res.sendStatus(404)
		)
		.catch(next);
}

function askForVerification(req, res, next) {
	roomService
		.askForVerification(req.params.id)
		.then((walker) => res.json(walker))
		.catch(next);
}

function verifyWalker(req, res, next) {
	roomService
		.verifyWalker(req.params.id)
		.then((walker) => res.json(walker))
		.catch(next);
}
