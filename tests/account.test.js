const { api, server, login, user } = require('./helpers');
const mongoose = require('mongoose');

let userToCreate = {
	role: 'Mrs',
	name: 'name',
	email: 'correo2@correo2.com',
	password: '654321',
	confirmPassword: '654321',
	role: 'User',
};

let token = '';
let users = [];
let userToDelete = {};
let userToEdit = {};

beforeAll(async () => {
	token = await login();

	const response = await api
		.post('/accounts')
		.set('Authorization', `Bearer ${token}`)
		.send({
			role: 'Mrs',
			name: 'nameDelete',
			email: 'correo@correoDelete.com',
			password: '654321',
			confirmPassword: '654321',
			role: 'User',
		});

	console.log(response.body);
	userToDelete = response.body;

	const editResponse = await api
		.post('/accounts')
		.set('Authorization', `Bearer ${token}`)
		.send({
			role: 'Mrs',
			name: 'nameEdit',
			email: 'correo@correoEdit.com',
			password: '654321',
			confirmPassword: '654321',
			role: 'User',
		});

	console.log(editResponse.body);
	userToEdit = editResponse.body;
});

describe('GET all users', () => {
	test('users are returned as json', async () => {
		const response = await api
			.get('/accounts')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		users = response.body;
	});

	test('is not possible without token', async () => {
		await api.get('/accounts').expect(401);
	});
});

describe('GET one user', () => {
	test('user are returned as json', async () => {
		await api
			.get(`/accounts/${users[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('is not possible without token', async () => {
		await api.get(`/accounts/${users[0].id}`).expect(401);
	});
});

describe('LOGIN', () => {
	test('is possible with a valid user', async () => {
		await api
			.post('/accounts/authenticate')
			.send(user)
			.expect(200);
	});

	test('is not possible with invalid user', async () => {
		const invalidUser = {
			email: 'email@incorrect.com',
			password: 'incorrect Password',
		};
		await api
			.post('/accounts/authenticate')
			.send(invalidUser)
			.expect(400);
	});
});

describe('REGISTER ', () => {
	test('is possible with a valid user', async () => {
		const userToRegister = {
			role: 'Mrs',
			name: 'edwd',
			email: 'correo@correo.com',
			password: '654321',
			confirmPassword: '654321',
			acceptTerms: true,
		};

		await api
			.post('/accounts/register')
			.send(userToRegister)
			.expect(200);
	});

	test('is not possible with an invalid user', async () => {
		const invalidUser = {
			role: 'Ms',
			name: 'name',
		};
		await api
			.post('/accounts/register')
			.send(invalidUser)
			.expect(400);
	});
});

describe('CREATE account', () => {
	test('is possible with a valid user', async () => {
		const response = await api
			.post('/accounts')
			.set('Authorization', `Bearer ${token}`)
			.send(userToCreate)
			.expect(200);

		userToCreate = response.body;
	});

	test('is not possible with an invalid user', async () => {
		const invalidUser = {
			role: 'Ms',
			name: 'name',
		};
		await api
			.post('/accounts/')
			.set('Authorization', `Bearer ${token}`)
			.send(invalidUser)
			.expect(400);
	});

	test('is not possible without token', async () => {
		await api
			.post('/accounts')
			.send(userToCreate)
			.expect(401);
	});
});

describe('EDIT user', () => {
	test('a user can be edited', async () => {
		userToEdit.name = 'another name';

		await api
			.put(`/accounts/${userToEdit.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(userToEdit)
			.expect(200);
	});

	test('a user that has an invalid id can not be edited', async () => {
		await api
			.put('/accounts/1234')
			.set('Authorization', `Bearer ${token}`)
			.send(user)
			.expect(400);
	});

	test('a user that has a valid id but do not exist can not be edited', async () => {
		const validObjectIdThatDoNotExist =
			'60451827152dc22ad768f442';
		await api
			.put(`/accounts/${validObjectIdThatDoNotExist}`)
			.set('Authorization', `Bearer ${token}`)
			.send(user)
			.expect(400);
	});
});

describe('DELETE user', () => {
	test('a user can be deleted', async () => {
		await api
			.delete(`/accounts/${userToDelete.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});

	test('a user that has an invalid id can not be deleted', async () => {
		await api
			.delete('/accounts/1234')
			.set('Authorization', `Bearer ${token}`)
			.expect(404);
	});

	test('a user that has a valid id but do not exist can not be deleted', async () => {
		const validObjectIdThatDoNotExist =
			'60451827152dc22ad768f442';
		await api
			.delete(`/accounts/${validObjectIdThatDoNotExist}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);
	});
});

afterAll(async () => {
	await api
		.delete(`/accounts/${userToEdit.id}`)
		.set('Authorization', `Bearer ${token}`);
	await api
		.delete(`/accounts/${userToCreate.id}`)
		.set('Authorization', `Bearer ${token}`);
	mongoose.connection.close();
	server.close();
});
