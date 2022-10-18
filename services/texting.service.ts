import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_NUMBER;
const client = twilio(accountSid, authToken);

export async function send(to: string, body: string) {
	const message = await client.messages.create({
		body: body,
		from: from,
		to: to,
	});

	return true;
}

export async function sendMMS(to: string, body: string, mediaLocation: string) {
	const message = await client.messages.create({
		body: body,
		mediaUrl: [mediaLocation],
		from: from,
		to: to,
	});

	return true;
}

type MessageType = {
	body: string;
	to: string;
};

export async function sendMultiple(messages: MessageType[]) {
	let successes = 0;

	for (let index = 0; index < messages.length; index++) {
		try {
			const message = await client.messages.create({
				body: messages[index].body,
				from: from,
				to: messages[index].to,
			});
			message.sid ? successes++ : null;
		} catch (error) {
			console.log("TWILIO ERROR - couldn't send texts");
			console.log(error);
		}
	}

	return successes;
}

export async function sendWelcomeTexts(to: string) {
	await send(to, 'Welcome to BeFit!');

	return true;
}
