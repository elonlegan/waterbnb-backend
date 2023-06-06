const db = require('../database');
const sendEmail = require('../helpers/send-email');

module.exports = {
	getAll,
	getById,
	getByRoomId,
	create,
	update,
	delete: _delete,
};

async function getAll(user) {
	const bookings = (
		await db.Booking
			.find
			// $or: [
			// 	{ 'room.hotel.owner': user.id },
			// 	{ owner: user.id },
			// ],
			()
			.populate({
				path: 'room',
				// Get friends of friends - populate the 'friends' array for every friend
				populate: { path: 'hotel' },
			})
	) // provisional todo: fix query at top
		.filter(
			(booking) =>
				booking.room.hotel.owner == user.id ||
				booking.owner == user.id
		);

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

async function create(params, userId, origin) {
	const booking = new db.Booking(params);

	let room = await getRoom(params.room);

	booking.owner = userId;
	booking.room = room;
	room.bookings = [...room.bookings, booking];

	// await room.save();
	// save booking
	await booking.save();

	let user = await getUser(userId);

	await sendBookingEmail(booking, user.email, origin);

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
	const room = await db.Room.findById(id).populate('hotel');
	if (!room) throw 'Room not found';
	return room;
}
async function getUser(id) {
	if (!db.isValidId(id)) throw 'User not found';
	const user = await db.Account.findById(id);
	if (!user) throw 'User not found';
	return user;
}

async function sendBookingEmail(
	booking,
	userEmail,
	origin
) {
	const bookingDetailUrl = `${origin}/bookings/detail/${booking.id}`;
	let message = `<p>You can see your booking info here:</p>
                   <p><a href="${bookingDetailUrl}">${bookingDetailUrl}</a></p>`;

	await sendEmail({
		to: userEmail,
		subject: `Booking ${booking.room.hotel.name} Hotel`,
		html: `<h4>Booking Successful  </h4>
               <p>Thanks for booking in ${booking.room.name} room!</p>
               ${message}`,
	});
}
