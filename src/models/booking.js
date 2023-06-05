const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmergencyContactSchema = mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phoneNumber: { type: String, required: true },
});

const HostSchema = mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phoneNumber: { type: String, required: true },
	birthDate: { type: Date, required: true },
	gender: { type: String, required: true },
	documentType: { type: String, required: true },
	documentNumber: { type: String, required: true },
	email: { type: String, required: true },
	phoneNumber: { type: String, required: true },
});

const schema = new Schema(
	{
		emergencyContacts: [
			{
				type: EmergencyContactSchema,
				required: true,
			},
		],
		hosts: [
			{
				type: HostSchema,
				required: true,
			},
		],
		arrivalDate: { type: Date, required: true },
		departureDate: { type: Date, required: true },
		room: { type: Schema.Types.ObjectId, ref: 'Room' },
	},
	{ timestamps: true, versionKey: false }
);

schema.set('toJSON', {
	virtuals: true,
	transform: function (doc, ret) {
		// remove these props when object is serialized
		delete ret._id;
	},
});

module.exports = mongoose.model('Booking', schema);
