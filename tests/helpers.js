const { app, server } = require('../src/index');
const supertest = require('supertest');

const api = supertest(app);

const user = {
	email: 'elonlegan@gmail.com',
	password: '123456',
};

async function login() {
	const response = await api
		.post('/accounts/authenticate')
		.send(user);
	return response.body.jwtToken;
}

const getAllTitleFromHotels = async (token) => {
	const response = await api
		.get('/hotels')
		.set('Authorization', `Bearer ${token}`);
	return {
		titles: response.body.map((hotel) => hotel.title),
		response,
	};
};
const getAllReports = async (token) => {
	const response = await api
		.get('/reports')
		.set('Authorization', `Bearer ${token}`);
	return {
		reportsHours: response.body.map(
			(report) => report.hours
		),
		response,
	};
};

module.exports = {
	api,
	server,
	login,
	getAllTitleFromHotels,
	getAllReports,
	user,
};
