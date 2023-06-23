const db = require('../database');

module.exports = {
	getAll,
	getById,
	getByHotelId,
	searchForBook,
	create,
	update,
	delete: _delete,
};

async function getAll() {
	const walkers = await db.Walker.find();
	return walkers;
}
async function getById(id) {
	const walker = await getRoom(id);
	return walker;
}
async function getByHotelId(hotelId) {
	const walkers = await db.Walker.find({ hotel: hotelId });
	return walkers;
}
async function searchForBook(params) {
	const walkers = await db.Walker.find({
		city: params.city,
		maxHost: {
			$gt: parseInt(params.hostNumber) - 1,
		},
		available: true,
	})
		.populate('bookings')
		.populate('hotel');
	return walkers;
}

async function create(params) {
	// validate
	if (await db.Walker.findOne({ name: params.name })) {
		throw 'Walker "' + params.name + '" is already created';
	}

	const walker = new db.Walker(params);

	let hotel = await getHotel(params.hotel);

	walker.hotel = hotel;
	hotel.walkers = [...hotel.walkers, walker];

	await hotel.save();
	// save walker
	await walker.save();

	return walker;
}

async function update(id, params) {
	// validate
	const roomExist = await db.Walker.findOne({
		name: params.name,
	});
	if (roomExist && roomExist.id !== id) {
		throw 'Walker "' + params.name + '" is already created';
	}
	const walker = await getRoom(id);

	// copy params to walker and save
	Object.assign(walker, params);

	await walker.save();

	return walker;
}

async function _delete(id) {
	const walker = await getRoom(id);
	await walker.remove();
}

// helper functions

async function getRoom(id) {
	if (!db.isValidId(id)) throw 'Walker not found';
	const walker = await db.Walker.findById(id);
	if (!walker) throw 'Walker not found';
	return walker;
}
async function getHotel(id) {
	console.log(id);
	if (!db.isValidId(id)) throw 'Hotel not found';
	const hotel = await db.Hotel.findById(id);
	if (!hotel) throw 'Hotel not found';
	return hotel;
}
