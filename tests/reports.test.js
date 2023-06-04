const {
	api,
	server,
	login,
	getAllReports,
} = require('./helpers');
const mongoose = require('mongoose');

let hotelToInit = {
	title: 'hotel to make test',
	startWeek: '2099-W30',
	finishWeek: '2099-W40',
	imageUrl:
		'https://latarta.com.co/wp-content/uploads/2018/06/default-placeholder.png',
};

let reportExample = {
	hours: 8,
};

let token = '';

beforeAll(async () => {
	token = await login();

	const { body: hotelResponse } = await api
		.post('/hotels')
		.set('Authorization', `Bearer ${token}`)
		.send(hotelToInit);

	hotelToInit = hotelResponse;

	reportExample.hotel = hotelToInit.id;
	reportExample.week = hotelToInit.startWeek;
});

describe('GET all reports', () => {
	test('reports are returned as json', async () => {
		await api
			.get('/reports')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('is not possible without token', async () => {
		await api.get('/reports').expect(401);
	});
});

describe('CREATE a report', () => {
	test('is possible with a valid report', async () => {
		const response = await api
			.post('/reports')
			.set('Authorization', `Bearer ${token}`)
			.send(reportExample)
			.expect(200)
			.expect('Content-Type', /application\/json/);
		const { reportsHours } = await getAllReports(token);
		expect(reportsHours).toContain(reportExample.hours);
	});

	test('is not possible without token', async () => {
		await api
			.post('/reports')
			.send(reportExample)
			.expect(401);
	});

	test('is not possible with an invalid report', async () => {
		const invalidReport = {
			hours: 'report title invalid',
		};
		await api
			.post('/reports')
			.set('Authorization', `Bearer ${token}`)
			.send(invalidReport)
			.expect(400);
		const { reportsHours } = await getAllReports(token);
		expect(reportsHours).not.toContain(invalidReport.hours);
	});
});

describe('EDIT report', () => {
	test('a report can be edited', async () => {
		const { response: firstResponse } = await getAllReports(
			token
		);
		const { body: reports } = firstResponse;
		let reportToEdit = reportExample;

		reportToEdit.hours = 4;

		await api
			.put(`/reports/${reports[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(reportToEdit)
			.expect(200);
	});

	test('a report that has an invalid id can not be edited', async () => {
		await api
			.put('/reports/1234')
			.set('Authorization', `Bearer ${token}`)
			.send(reportExample)
			.expect(404);
	});

	test('a report that has a valid id but do not exist can not be edited', async () => {
		const validObjectIdThatDoNotExist =
			'60451827152dc22ad768f442';

		const response = await api
			.put(`/reports/${validObjectIdThatDoNotExist}`)
			.set('Authorization', `Bearer ${token}`)
			.send(reportExample)
			.expect(404);
	});
});

describe('DELETE report', () => {
	test('a report can be deleted', async () => {
		const { response: firstResponse } = await getAllReports(
			token
		);
		const { body: reports } = firstResponse;
		const reportToDelete = reports[0];

		await api
			.delete(`/reports/${reportToDelete.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		const { reportsHours } = await getAllReports(token);

		expect(reportsHours).not.toContain(
			reportToDelete.hours
		);
	});

	test('a report that has an invalid id can not be deleted', async () => {
		await api
			.delete('/reports/1234')
			.set('Authorization', `Bearer ${token}`)
			.expect(404);
	});

	test('a report that has a valid id but do not exist can not be deleted', async () => {
		const validObjectIdThatDoNotExist =
			'60451827152dc22ad768f442';
		await api
			.delete(`/reports/${validObjectIdThatDoNotExist}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);
	});
});

afterAll(async () => {
	await api
		.delete(`/hotels/${hotelToInit.id}`)
		.set('Authorization', `Bearer ${token}`);

	mongoose.connection.close();
	server.close();
});
