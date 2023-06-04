const reportService = require('../services/report.service');
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');

module.exports = {
	getAll,
	getByHotelWeek,
	createSchema,
	create,
	updateSchema,
	update,
	delete: _delete,
};

function getAll(req, res, next) {
	reportService
		.getAll()
		.then((reports) => res.json(reports))
		.catch(next);
}

function getByHotelWeek(req, res, next) {
	reportService
		.getByHotelWeek({
			hotel: req.params.hotelId,
			week: req.params.weekId,
			user: req.user.id,
		})
		.then((report) =>
			report ? res.json(report) : res.sendStatus(404)
		)
		.catch(next);
}

function createSchema(req, res, next) {
	const schema = Joi.object({
		hours: Joi.number().required(),
		hotel: Joi.string().required(),
		week: Joi.string().required(),
	});
	validateRequest(req, next, schema);
}

function create(req, res, next) {
	reportService
		.create({ ...req.body, user: req.user.id })
		.then((report) => res.json(report))
		.catch(next);
}

function updateSchema(req, res, next) {
	const schema = Joi.object({
		hours: Joi.number().required(),
		hotel: Joi.string().required(),
		week: Joi.string().required(),
	});
	validateRequest(req, next, schema);
}

function update(req, res, next) {
	reportService
		.update(req.params.id, {
			...req.body,
			user: req.user.id,
		})
		.then((report) =>
			report ? res.json(report) : res.sendStatus(404)
		)
		.catch(next);
}

function _delete(req, res, next) {
	reportService
		.delete(req.params.id)
		.then((report) =>
			report
				? res.json({
						message: 'Report deleted successfully',
				  })
				: res.sendStatus(404)
		)
		.catch(next);
}
