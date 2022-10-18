// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUser } from 'services/serverside.service';
import { sendWelcomeTexts } from 'services/texting.service';

type Data = {
	phoneNumber: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method === 'POST') {
		// Process a POST request
		const { phoneNumber } = req.body;
		console.log(phoneNumber);

		const decoratedPhoneNumber = `+${phoneNumber}`;

		const user = await getUser(decoratedPhoneNumber);

		if (!user) {
			console.log('Creating a new user!');
			await createUser(decoratedPhoneNumber);
			await sendWelcomeTexts(decoratedPhoneNumber);
		}

		return res.status(200).json({ phoneNumber: decoratedPhoneNumber });
	}

	res.status(200).json({ phoneNumber: 'John Doe' });
}
