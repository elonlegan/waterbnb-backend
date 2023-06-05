const db = require('../database');

module.exports = {
	getAll,
	getById,
	getByRoomId,
	create,
	update,
	delete: _delete,
};

async function getAll(userId) {
	const bookings = await db.Booking.find({
		$or: [
			{ 'room.hotel.owner': userId },
			{ owner: userId },
		],
	}).populate({
		path: 'room',
		populate: { path: 'hotel' },
	});
	return bookings;
}
async function getById(id) {
	const booking = await getBooking(id);
	return booking;
}
async function getByRoomId(hotelId) {
	const bookings = await db.Booking.find({
		room: hotelId,
	}).populate('room');
	return bookings;
}

async function create(params, userId) {
	const booking = new db.Booking(params);

	let room = await getRoom(params.room);

	booking.owner = userId;
	booking.room = room;
	room.bookings = [...room.bookings, booking];

	await room.save();
	// save booking
	await booking.save();

	return booking;
}

async function update(id, params) {
	// validate
	const bookingExist = await db.Booking.findOne({
		name: params.name,
	});
	if (bookingExist && bookingExist.id !== id) {
		throw (
			'Booking "' + params.name + '" is already created'
		);
	}
	const booking = await getBooking(id);

	// copy params to booking and save
	Object.assign(booking, params);

	await booking.save();

	return booking;
}

async function _delete(id) {
	const booking = await getBooking(id);
	await booking.remove();
}

// helper functions

async function getBooking(id) {
	if (!db.isValidId(id)) throw 'Booking not found';
	const booking = await db.Booking.findById(id);
	if (!booking) throw 'Booking not found';
	return booking;
}
async function getRoom(id) {
	if (!db.isValidId(id)) throw 'Room not found';
	const room = await db.Room.findById(id);
	if (!room) throw 'Room not found';
	return room;
}
