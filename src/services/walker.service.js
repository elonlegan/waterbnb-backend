const db = require('../database');
const Role = require('../helpers/role');

module.exports = {
	getAll,
	getById,
	askForVerification,
	verifyWalker,
};

async function getAll(searchQuery) {
	let query = { role: Role.PetWalker };

	if (searchQuery) {
		query = {
			...query,
			$or: [
				{ name: { $regex: searchQuery, $options: 'i' } },
				{ email: { $regex: searchQuery, $options: 'i' } },
			],
		};
	}

	const walkers = await db.Account.find(query);
	return walkers;
}
async function getById(id) {
	const walker = await getWalker(id);
	return walker;
}

async function askForVerification(id) {
	const walker = await getWalker(id);

	// copy params to walker and save
	Object.assign(walker, { verificationRequested: true });

	await walker.save();

	return walker;
}
async function verifyWalker(id) {
	const walker = await getWalker(id);

	// copy params to walker and save
	Object.assign(walker, {
		verifiedWalker: true,
		verificationRequested: false,
	});

	await walker.save();

	return walker;
}

// helper functions

async function getWalker(id) {
	if (!db.isValidId(id)) throw 'Walker not found';
	const walker = await db.Account.findById(id);
	if (!walker) throw 'Walker not found';
	return walker;
}
