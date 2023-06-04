const nodemailer = require('nodemailer');

module.exports = sendEmail;

async function sendEmail({
	to,
	subject,
	html,
	from = process.env.GOOGLE_USER,
}) {
	const transporter = nodemailer.createTransport({
		service: process.env.EMAIL_SERVICE || 'gmail',
		auth: {
			user: process.env.GOOGLE_USER,
			pass: process.env.GOOGLE_PASSWORD,
		},
	});
	await transporter.sendMail(
		{ from, to, subject, html },
		function (err, info) {
			if (err) {
				console.error(err);
			} else {
				console.log(info);
			}
		}
	);
}
