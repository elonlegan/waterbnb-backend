const bookingService = require('../services/booking.service');
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');

module.exports = {
	getAll,
	getById,
	getByHotelId,
	getRoomTypes,
	createSchema,
	create,
	updateSchema,
	update,
	delete: _delete,
};

function getAll(req, res, next) {
	bookingService
		.getAll(req.user)
		.then((bookings) => res.json(bookings))
		.catch(next);
}

function getById(req, res, next) {
	bookingService
		.getById(req.params.id)
		.then((booking) =>
			booking ? res.json(booking) : res.sendStatus(404)
		)
		.catch(next);
}

function getByHotelId(req, res, next) {
	bookingService
		.getByHotelId(req.params.hotelId)
		.then((bookings) => res.json(bookings))
		.catch(next);
}
function getRoomTypes(req, res, next) {
	bookingService
		.getRoomTypes()
		.then((bookingTypes) => res.json(bookingTypes))
		.catch(next);
}

function createSchema(req, res, next) {
	const schema = Joi.object({
		emergencyContacts: Joi.array().required(),
		arrivalDate: Joi.date().required(),
		departureDate: Joi.date().required(),
		room: Joi.string().required(),
		hosts: Joi.array().required(),
	});
	validateRequest(req, next, schema);
}

function create(req, res, next) {
	bookingService
		.create(req.body, req.user.id, req.get('origin'))
		.then((booking) => res.json(booking))
		.catch(next);
}

function updateSchema(req, res, next) {
	const schema = Joi.object({
		emergencyContacts: Joi.array().empty(''),
		arrivalDate: Joi.date().empty(''),
		departureDate: Joi.date().empty(''),
		room: Joi.string().empty(''),
		hosts: Joi.array().empty(''),
	});
	validateRequest(req, next, schema);
}

function update(req, res, next) {
	bookingService
		.update(req.params.id, req.body)
		.then((booking) => res.json(booking))
		.catch(next);
}

function _delete(req, res, next) {
	bookingService
		.delete(req.params.id)
		.then(() =>
			res.json({ message: 'booking deleted successfully' })
		)
		.catch(next);
}
