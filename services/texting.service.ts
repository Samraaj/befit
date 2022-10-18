import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_NUMBER;
const client = twilio(accountSid, authToken);

export async function send(to: string, body: string) {
	await client.messages.create({
		body: body,
		from: from,
		to: to,
	});

	return true;
}

export async function sendMMS(to: string, body: string, mediaLocation: string) {
	await client.messages.create({
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
	await send(
		to,
		'Welcome to BeFit!\n\nBeFit is a social workout app that sends you a text every day to remind you to stay active.'
	);

	await send(
		to,
		'Every day you will receive a text when it is time to BeFit! And you better get to it, since we will know how long it takes you to respond 👀. At the end of the day, everyone will get a text that shows how long it took everyone else to BeFit.\n\nReply with a name to create a nickname for yourself that others will see in the summary texts!'
	);

	await send(to, 'If you want to stop receiving texts, reply with "STOP".');

	return true;
}

export async function timeToBeFit(to: string[], workout: string) {
	const messages = to.map((phone) => {
		return {
			body: "⚠️ Time to BeFit. ⚠️\n\nYou have 5 minutes to complete the exercise and see your friends do theirs. Text 'DONE' when you're finished.",
			to: phone,
		};
	});

	const successes = await sendMultiple(messages);

	const workoutMessages = to.map((phone) => {
		return {
			body: workout,
			to: phone,
		};
	});

	await sendMultiple(workoutMessages);

	return successes;
}
