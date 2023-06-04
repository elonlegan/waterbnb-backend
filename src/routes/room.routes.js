const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

// Controllers
const roomController = require('../controllers/room.controller');

// routes
router.get('/', roomController.getAll);

router.get(
	'/:id',
	authorize(Role.Admin),
	roomController.getById
);

router.post(
	'/',
	authorize(Role.Admin),
	roomController.createSchema,
	roomController.create
);

router.put(
	'/:id',
	authorize(Role.Admin),
	roomController.updateSchema,
	roomController.update
);

router.delete(
	'/:id',
	authorize(Role.Admin),
	roomController.delete
);

module.exports = router;
