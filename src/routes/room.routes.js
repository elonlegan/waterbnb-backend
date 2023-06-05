const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

// Controllers
const roomController = require('../controllers/room.controller');

// routes
router.get('/', roomController.getAll);

router.get('/room-types', roomController.getRoomTypes);

router.get(
	'/search',
	authorize(),
	roomController.searchForBook
);

router.get('/:id', authorize(), roomController.getById);

router.get(
	'/hotel/:hotelId',
	authorize([Role.Admin, Role.TravelAgency]),
	roomController.getByHotelId
);

router.post(
	'/',
	authorize([Role.Admin, Role.TravelAgency]),
	roomController.createSchema,
	roomController.create
);

router.put(
	'/:id',
	authorize([Role.Admin, Role.TravelAgency]),
	roomController.updateSchema,
	roomController.update
);

router.delete(
	'/:id',
	authorize([Role.Admin, Role.TravelAgency]),
	roomController.delete
);

module.exports = router;
