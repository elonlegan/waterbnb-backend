const hotelService = require('../services/hotel.service');
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
	hotelService
		.getAll(req.user.id)
		.then((hotels) => res.json(hotels))
		.catch(next);
}

function getById(req, res, next) {
	hotelService
		.getById(req.params.id)
		.then((hotel) =>
			hotel ? res.json(hotel) : res.sendStatus(404)
		)
		.catch(next);
}

function createSchema(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().empty(''),
		imageUrl: Joi.string().empty(''),
		rooms: Joi.array().empty(''),
	});
	validateRequest(req, next, schema);
}

function create(req, res, next) {
	hotelService
		.create(req.body, req.user)
		.then((hotel) => res.json(hotel))
		.catch(next);
}

function updateSchema(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().empty(''),
		description: Joi.string().empty(''),
		imageUrl: Joi.string().empty(''),
		rooms: Joi.array().empty(''),
	});
	validateRequest(req, next, schema);
}

function update(req, res, next) {
	hotelService
		.update(req.params.id, req.body)
		.then((hotel) => res.json(hotel))
		.catch(next);
}

function _delete(req, res, next) {
	hotelService
		.delete(req.params.id)
		.then(() =>
			res.json({ message: 'Hotel deleted successfully' })
		)
		.catch(next);
}
