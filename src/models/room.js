const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		country: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		maxHost: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			required: false,
		},
		imageUrl: {
			type: String,
			default:
				'https://latarta.com.co/wp-content/uploads/2018/06/default-placeholder.png',
		},
		hotel: { type: Schema.Types.ObjectId, ref: 'Hotel' },
		bookings: [
			{ type: Schema.Types.ObjectId, ref: 'Booking' },
		],
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

module.exports = mongoose.model('Room', schema);
