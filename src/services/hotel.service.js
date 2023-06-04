const db = require('../database');

module.exports = {
	getAll,
	getById,
	create,
	update,
	delete: _delete,
};

async function getAll() {
	const hotels = await db.Hotel.find().populate('rooms');
	return hotels;
}
async function getById(id) {
	const hotel = await getHotel(id);
	return hotel;
}

async function create(params) {
	// validate
	if (await db.Hotel.findOne({ title: params.title })) {
		throw 'Hotel "' + params.title + '" is already created';
	}

	const hotel = new db.Hotel(params);

	console.log('hotel', hotel);

	// save hotel
	await hotel.save();

	return hotel;
}

async function update(id, params) {
	// validate
	const hotelExist = await db.Hotel.findOne({
		title: params.title,
	});
	if (hotelExist && hotelExist.id !== id) {
		throw 'Hotel "' + params.title + '" is already created';
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
