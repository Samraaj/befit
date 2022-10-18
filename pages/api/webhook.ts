// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
	disableUser,
	getUser,
	logMostRecentWorkout,
	updateUserName,
} from 'services/serverside.service';
import { send } from 'services/texting.service';

type Data = {
	phoneNumber: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	console.log('WEBHOOK!');
	console.log(req.method);
	console.log(req.body);

	if (req.method === 'POST') {
		const { From: phoneNumber, Body: body } = req.body;

		const user = await getUser(phoneNumber);
		if (!user) {
			console.log('User does not exist!');
			return res.status(200).json({ phoneNumber });
		}

		if (body === 'DONE') {
			console.log('User has completed a workout!');
			await logMostRecentWorkout(phoneNumber);
			await send(phoneNumber, `🔥 Nice work 🔥`);
		} else if (body === 'STOP') {
			console.log('User has unsubscribed!');
			await disableUser(phoneNumber);
			await send(phoneNumber, `😢 Sorry to see you go 😢`);
		} else {
			console.log('User is updating their name!');
			await updateUserName(phoneNumber, body);
			await send(phoneNumber, `Thanks for updating your name to ${body}!`);
		}
	}
	res.status(200).json({ phoneNumber: 'John Doe' });
}
