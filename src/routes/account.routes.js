const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

// Controllers
const accountController = require('../controllers/account.controller');

// routes
router.post(
	'/authenticate',
	accountController.authenticateSchema,
	accountController.authenticate
);

router.post(
	'/refresh-token',
	accountController.refreshToken
);

router.post(
	'/revoke-token',
	authorize(),
	accountController.revokeTokenSchema,
	accountController.revokeToken
);

router.get('/roles', accountController.getRoles);

router.post(
	'/register',
	accountController.registerSchema,
	accountController.register
);

router.post(
	'/verify-email',
	accountController.verifyEmailSchema,
	accountController.verifyEmail
);

router.post(
	'/forgot-password',
	accountController.forgotPasswordSchema,
	accountController.forgotPassword
);

router.post(
	'/validate-reset-token',
	accountController.validateResetTokenSchema,
	accountController.validateResetToken
);

router.post(
	'/reset-password',
	accountController.resetPasswordSchema,
	accountController.resetPassword
);

router.get(
	'/',
	authorize(Role.Admin),
	accountController.getAll
);

router.get('/:id', authorize(), accountController.getById);

router.post(
	'/',
	authorize(Role.Admin),
	accountController.createSchema,
	accountController.create
);

router.put(
	'/:id',
	authorize(),
	accountController.updateSchema,
	accountController.update
);

router.delete(
	'/:id',
	authorize(),
	accountController.delete
);

module.exports = router;
