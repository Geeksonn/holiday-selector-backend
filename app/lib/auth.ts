import { createClient } from '@/utils/supabase';
import { User } from '@supabase/auth-js';

const getUser = async (token: string): Promise<User | null> => {
    const supabase = await createClient(token);
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error while getting user: ', error);
        return null;
    }
    if (!data) {
        console.error('No user where found');
        return null;
    }
    return data.user;
};

export default getUser;
