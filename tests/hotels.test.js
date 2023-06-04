const {
	api,
	server,
	login,
	getAllTitleFromHotels,
} = require('./helpers');
const mongoose = require('mongoose');
const res = require('express/lib/response');

let hotelExample = {
	title: 'hotel title',
	startWeek: '2022-W10',
	finishWeek: '2022-W11',
	imageUrl:
		'https://latarta.com.co/wp-content/uploads/2018/06/default-placeholder.png',
};

let hotelToEdit = {};

let token = '';

beforeAll(async () => {
	token = await login();

	const editResponse = await api
		.post('/hotels')
		.set('Authorization', `Bearer ${token}`)
		.send({
			title: 'hotel title to edit',
			startWeek: '2022-W10',
			finishWeek: '2022-W11',
			imageUrl:
				'https://latarta.com.co/wp-content/uploads/2018/06/default-placeholder.png',
		});

	hotelToEdit = editResponse.body;
});

describe('GET all hotels', () => {
	test('hotels are returned as json', async () => {
		await api
			.get('/hotels')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('is not possible without token', async () => {
		await api.get('/hotels').expect(401);
	});
});

describe('CREATE a hotel', () => {
	test('is possible with a valid hotel', async () => {
		const response = await api
			.post('/hotels')
			.set('Authorization', `Bearer ${token}`)
			.send(hotelExample)
			.expect(200)
			.expect('Content-Type', /application\/json/);
		const { titles } = await getAllTitleFromHotels(token);
		expect(titles).toContain(hotelExample.title);

		hotelExample = response.body;
	});

	test('is not possible without token', async () => {
		await api
			.post('/hotels')
			.send(hotelExample)
			.expect(401);
	});

	test('is not possible with an invalid hotel', async () => {
		const invalidHotel = {
			title: 'hotel title invalid',
		};
		await api
			.post('/hotels')
			.set('Authorization', `Bearer ${token}`)
			.send(invalidHotel)
			.expect(400);
		const { titles } = await getAllTitleFromHotels(token);
		expect(titles).not.toContain(invalidHotel.title);
	});
});

describe('EDIT hotel', () => {
	test('a hotel can be edited', async () => {
		hotelToEdit.title = 'hotel title edited';
		hotelToEdit.startWeek = '2022-W20';
		hotelToEdit.finishWeek = '2022-W27';

		const response = await api
			.put(`/hotels/${hotelToEdit.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(hotelToEdit)
			.expect(200);
	});

	test('a hotel that has an invalid id can not be edited', async () => {
		await api
			.put('/hotels/1234')
			.set('Authorization', `Bearer ${token}`)
			.send(hotelExample)
			.expect(400);
	});

	test('a hotel that has a valid id but do not exist can not be edited', async () => {
		const validObjectIdThatDoNotExist =
			'60451827152dc22ad768f442';
		await api
			.put(`/hotels/${validObjectIdThatDoNotExist}`)
			.set('Authorization', `Bearer ${token}`)
			.send(hotelExample)
			.expect(400);
	});
});

describe('DELETE hotel', () => {
	test('a hotel can be deleted', async () => {
		const { response: firstResponse } =
			await getAllTitleFromHotels(token);
		const { body: hotels } = firstResponse;
		const hotelToDelete = hotels[0];

		await api
			.delete(`/hotels/${hotelToDelete.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		const { titles } = await getAllTitleFromHotels(token);

		expect(titles).not.toContain(hotelToDelete.content);
	});

	test('a hotel that has an invalid id can not be deleted', async () => {
		await api
			.delete('/hotels/1234')
			.set('Authorization', `Bearer ${token}`)
			.expect(404);
	});

	test('a hotel that has a valid id but do not exist can not be deleted', async () => {
		const validObjectIdThatDoNotExist =
			'60451827152dc22ad768f442';
		await api
			.delete(`/hotels/${validObjectIdThatDoNotExist}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);
	});
});

afterAll(async () => {
	await api
		.delete(`/hotels/${hotelToEdit.id}`)
		.set('Authorization', `Bearer ${token}`);
	await api
		.delete(`/hotels/${hotelExample.id}`)
		.set('Authorization', `Bearer ${token}`);
	mongoose.connection.close();
	server.close();
});
