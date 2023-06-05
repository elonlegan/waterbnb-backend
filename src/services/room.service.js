const db = require('../database');
const RoomTypes = require('../helpers/room-types');

module.exports = {
	getAll,
	getById,
	getByHotelId,
	getRoomTypes,
	create,
	update,
	delete: _delete,
};

async function getAll() {
	const rooms = await db.Room.find();
	return rooms;
}
async function getById(id) {
	const room = await getRoom(id);
	return room;
}
async function getByHotelId(hotelId) {
	const rooms = await db.Room.find({ hotel: hotelId });
	return rooms;
}
async function getRoomTypes() {
	return RoomTypes;
}

async function create(params) {
	// validate
	if (await db.Room.findOne({ name: params.name })) {
		throw 'Room "' + params.name + '" is already created';
	}

	const room = new db.Room(params);

	let hotel = await getHotel(params.hotel);

	room.hotel = hotel;
	hotel.rooms = [...hotel.rooms, room];

	await hotel.save();
	// save room
	await room.save();

	return room;
}

async function update(id, params) {
	// validate
	const roomExist = await db.Room.findOne({
		name: params.name,
	});
	if (roomExist && roomExist.id !== id) {
		throw 'Room "' + params.name + '" is already created';
	}
	const room = await getRoom(id);

	// copy params to room and save
	Object.assign(room, params);

	await room.save();

	return room;
}

async function _delete(id) {
	const room = await getRoom(id);
	await room.remove();
}

// helper functions

async function getRoom(id) {
	if (!db.isValidId(id)) throw 'Room not found';
	const room = await db.Room.findById(id);
	if (!room) throw 'Room not found';
	return room;
}
async function getHotel(id) {
	console.log(id);
	if (!db.isValidId(id)) throw 'Hotel not found';
	const hotel = await db.Hotel.findById(id);
	if (!hotel) throw 'Hotel not found';
	return hotel;
}
