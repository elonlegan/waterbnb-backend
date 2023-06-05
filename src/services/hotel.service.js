const db = require('../database');

module.exports = {
	getAll,
	getById,
	create,
	update,
	delete: _delete,
};

async function getAll(userId) {
	const hotels = await db.Hotel.find({
		owner: userId,
	}).populate('rooms');
	return hotels;
}
async function getById(id) {
	const hotel = await getHotel(id);
	return hotel;
}

async function create(params, user) {
	// validate
	if (await db.Hotel.findOne({ name: params.name })) {
		throw 'Hotel "' + params.name + '" is already created';
	}

	const hotel = new db.Hotel(params);

	hotel.owner = user.id;

	// save hotel
	await hotel.save();

	return hotel;
}

async function update(id, params) {
	// validate
	const hotelExist = await db.Hotel.findOne({
		name: params.name,
	});
	if (hotelExist && hotelExist.id !== id) {
		throw 'Hotel "' + params.name + '" is already created';
	}
	const hotel = await getHotel(id);

	// copy params to hotel and save
	Object.assign(hotel, params);

	await hotel.save();

	return hotel;
}

async function _delete(id) {
	const hotel = await getHotel(id);
	await hotel.remove();
}

// helper functions

async function getHotel(id) {
	if (!db.isValidId(id)) throw 'Hotel not found';
	const hotel = await db.Hotel.findById(id).populate(
		'rooms'
	);
	if (!hotel) throw 'Hotel not found';
	return hotel;
}
