const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

// Controllers
const hotelController = require('../controllers/hotel.controller');

// routes
router.get('/', hotelController.getAll);

router.get(
	'/:id',
	authorize(Role.Admin),
	hotelController.getById
);

router.post(
	'/',
	authorize(Role.Admin),
	hotelController.createSchema,
	hotelController.create
);

router.put(
	'/:id',
	authorize(Role.Admin),
	hotelController.updateSchema,
	hotelController.update
);

router.delete(
	'/:id',
	authorize(Role.Admin),
	hotelController.delete
);

module.exports = router;
