import { supabase } from 'lib/SupabaseServer';

export async function createUser(phone: string) {
	const { data, error } = await supabase
		.from('users')
		.insert([{ phone: phone }])
		.single();

	if (error) {
		console.log(error);
		return null;
	}

	return data;
}

export async function getUser(phone: string) {
	const { data: user, error } = await supabase
		.from('users')
		.select('*')
		.eq('phone', phone)
		.maybeSingle();

	if (error || !user) {
		console.log(error);
		return null;
	}

	return user;
}

export async function updateUserName(phone: string, newName: string) {
	const { data, error } = await supabase
		.from('users')
		.update({ name: newName })
		.eq('phone', phone)
		.maybeSingle();

	if (error || !data) {
		console.log(error);
		return null;
	}

	return data;
}

export async function logMostRecentWorkout(phone: string) {
	// figure out what is the most recent workout
	const { data: workout, error: workoutError } = await supabase
		.from('workouts')
		.select('*')
		.eq('textsSent', true)
		.order('created_at', { ascending: false })
		.limit(1);

	if (workoutError || !workout || workout.length === 0) {
		console.log(workoutError);
		return null;
	}

	// workout should be the most recent workout
	// add a workout entry
	const user = await getUser(phone);

	const { data: workoutEntry, error: workoutEntryError } = await supabase
		.from('workouts_completed')
		.insert([{ workout_id: workout[0].id, user_id: user.id }])
		.single();

	if (workoutEntryError || !workoutEntry) {
		console.log(workoutEntryError);
		return null;
	}

	return workoutEntry;
}
