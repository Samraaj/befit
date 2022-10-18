export type User = {
	id: string;
	created_at: string;
	phone: string;
	name: string;
};

export type Workout = {
	id: string;
	created_at: string;
	textsSent: boolean;
	text: string;
};

export type RawWorksoutsCompleted = {
	id: string;
	created_at: string;
	user_id: string;
	workout_id: string;
};

export type WorkoutsCompleted = {
	id: string;
	created_at: string;
	user: User;
	workout: Workout;
};
