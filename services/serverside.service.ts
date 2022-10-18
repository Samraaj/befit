import { supabase } from 'lib/SupabaseServer';
import { Workout } from 'types';

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

export async function getAllActiveUsers() {
	const { data: users, error } = await supabase.from('users').select('*').eq('disabled', false);

	if (error || !users) {
		console.log(error);
		return null;
	}

	return users;
}

export async function disableUser(phone: string) {
	const { data, error } = await supabase
		.from('users')
		.update({ disabled: true })
		.eq('phone', phone)
		.single();

	if (error) {
		console.log(error);
		return null;
	}

	return data;
}

export async function getWorkout(id: string) {
	const { data: workout, error } = await supabase
		.from('workouts')
		.select('*')
		.eq('id', id)
		.maybeSingle();

	if (error || !workout) {
		console.log(error);
		return null;
	}

	return workout as Workout;
}

export async function setWorkoutAsSent(id: string) {
	const { data, error } = await supabase.from('workouts').update({ sentTexts: true }).eq('id', id);

	if (error) {
		console.log(error);
		return null;
	}

	return data;
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

	// First, ensure user hasn't already logged this workout
	const { data: userWorkouts } = await supabase
		.from('workouts_completed')
		.select('*')
		.eq('user_id', user.id)
		.eq('workout_id', workout[0].id)
		.maybeSingle();

	if (userWorkouts) {
		console.log('User has already logged this workout!');
		return null;
	}

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
