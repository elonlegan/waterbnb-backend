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
	authorize([Role.Admin, Role.TravelAgency]),
	hotelController.getById
);

router.post(
	'/',
	authorize([Role.Admin, Role.TravelAgency]),
	hotelController.createSchema,
	hotelController.create
);

router.put(
	'/:id',
	authorize([Role.Admin, Role.TravelAgency]),
	hotelController.updateSchema,
	hotelController.update
);

router.delete(
	'/:id',
	authorize([Role.Admin, Role.TravelAgency]),
	hotelController.delete
);

module.exports = router;
