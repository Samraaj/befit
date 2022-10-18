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

		const samplePhoneNumber = '+14258029195';

		const user = await getUser(samplePhoneNumber);

		if (!user) {
			console.log('Creating a new user!');
			await createUser(samplePhoneNumber);
			await sendWelcomeTexts(samplePhoneNumber);
		}

		return res.status(200).json({ phoneNumber });
	}

	res.status(200).json({ phoneNumber: 'John Doe' });
}
