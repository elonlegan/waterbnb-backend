const roomService = require('../services/room.service');
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');

module.exports = {
	getAll,
	getById,
	createSchema,
	create,
	updateSchema,
	update,
	delete: _delete,
};

function getAll(req, res, next) {
	roomService
		.getAll()
		.then((rooms) => res.json(rooms))
		.catch(next);
}

function getById(req, res, next) {
	roomService
		.getById(req.params.id)
		.then((room) =>
			room ? res.json(room) : res.sendStatus(404)
		)
		.catch(next);
}

function createSchema(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().required(),
		imageUrl: Joi.string().empty('').optional(),
		description: Joi.string().empty('').optional(),
	});
	validateRequest(req, next, schema);
}

function create(req, res, next) {
	roomService
		.create(req.body)
		.then((room) => res.json(room))
		.catch(next);
}

function updateSchema(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().empty(''),
		imageUrl: Joi.string().empty(''),
		description: Joi.string().empty(''),
	});
	validateRequest(req, next, schema);
}

function update(req, res, next) {
	roomService
		.update(req.params.id, req.body)
		.then((room) => res.json(room))
		.catch(next);
}

function _delete(req, res, next) {
	roomService
		.delete(req.params.id)
		.then(() =>
			res.json({ message: 'room deleted successfully' })
		)
		.catch(next);
}
