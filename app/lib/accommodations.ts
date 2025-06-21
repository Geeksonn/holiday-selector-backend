import { createClient } from '@/utils/supabase';

export const createAccommodation = async (token: string, accommodation: Accommodation) => {
    const supabase = await createClient(token);

    const { data, error } = await supabase.from('accommodations').insert(accommodation).select();
    if (error) throw error;

    return data;
};

export const updateAccommodation = async (
    token: string,
    accommodationId: string,
    updates: Partial<Accommodation>
) => {
    const supabase = await createClient(token);

    const { data, error } = await supabase.from('accommodations').update(updates).eq('id', accommodationId);
    if (error) throw error;

    return data;
};
