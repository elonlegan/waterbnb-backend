const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
	{
		email: { type: String, unique: true, required: true },
		passwordHash: { type: String, required: true },
		role: { type: String, required: true },
		name: { type: String, required: true },
		imageUrl: {
			type: String,
			default:
				'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
		},
		acceptTerms: Boolean,
		verificationRequested: {
			type: Boolean,
			default: false,
		},
		verifiedWalker: {
			type: Boolean,
			default: false,
		},
		role: { type: String, required: true },
		verificationToken: String,
		verified: Date,
		resetToken: {
			token: String,
			expires: Date,
		},
		passwordReset: Date,
		created: { type: Date, default: Date.now },
		updated: Date,
	},
	{ timestamps: true, versionKey: false }
);

schema.virtual('isVerified').get(function () {
	return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
	virtuals: true,
	transform: function (doc, ret) {
		// remove these props when object is serialized
		delete ret._id;
		delete ret.passwordHash;
	},
});

module.exports = mongoose.model('Account', schema);
