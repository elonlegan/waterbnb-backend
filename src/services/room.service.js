const db = require('../database');

module.exports = {
	getAll,
	getById,
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

async function create(params) {
	// validate
	if (await db.Room.findOne({ title: params.title })) {
		throw 'Room "' + params.title + '" is already created';
	}

	const room = new db.Room(params);

	// save room
	await room.save();

	return room;
}

async function update(id, params) {
	// validate
	const roomExist = await db.Room.findOne({
		title: params.title,
	});
	if (roomExist && roomExist.id !== id) {
		throw 'Room "' + params.title + '" is already created';
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
