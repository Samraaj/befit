// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser, logMostRecentWorkout, updateUserName } from 'services/serverside.service';
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

		// const sendRes = await sendWelcomeTexts(samplePhoneNumber);

		// console.log(sendRes);

		const user = await getUser(samplePhoneNumber);
		const logged = await logMostRecentWorkout(samplePhoneNumber);

		console.log(user);

		return res.status(200).json({ phoneNumber });
	}

	res.status(200).json({ phoneNumber: 'John Doe' });
}
