import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	process.env.PUBLIC_SUPABASE_URL as string,
	process.env.PRIVATE_SUPABASE_SERVICE_KEY as string
);
