const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

// Controllers
const bookingController = require('../controllers/booking.controller');

// routes
router.get('/', authorize([]), bookingController.getAll);

router.get('/:id', authorize(), bookingController.getById);

router.post(
	'/',
	authorize([Role.User]),
	bookingController.createSchema,
	bookingController.create
);

router.put(
	'/:id',
	authorize([Role.User]),
	bookingController.updateSchema,
	bookingController.update
);

router.delete(
	'/:id',
	authorize([Role.User]),
	bookingController.delete
);

module.exports = router;
