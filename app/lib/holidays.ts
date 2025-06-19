import { createClient } from '@/utils/supabase';

export const getAllHolidays = async (token: string, userId: string, userEmail: string) => {
    const supabase = await createClient(token);

    const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .filter('participants', 'cs', `{${userEmail}}`)
        .order('start_date', { ascending: true })
        .limit(1000);
    if (error) throw error;

    return data;
};

export const getHolidayById = async (token: string, holidayId: string) => {
    const supabase = await createClient(token);

    const [holidayData, accommodationsData] = await Promise.all([
        supabase.from('holidays').select('*').eq('id', holidayId),
        supabase.from('accommodations').select('*').eq('holiday_id', holidayId),
    ]);
    if (holidayData.error || accommodationsData.error) {
        throw {
            error: 'Cannot retrieve detail of holiday',
        };
    }
    return {
        holiday: holidayData.data,
        accommodations: accommodationsData.data,
    };
};

export const createHoliday = async (token: string, holiday: Holiday) => {
    const supabase = await createClient(token);

    const { data, error } = await supabase.from('holidays').insert(holiday).select();
    if (error) throw error;

    return data;
};

export const deleteHoliday = async (token: string, holidayId: string) => {
    const supabase = await createClient(token);

    const { data, error } = await supabase.from('holidays').delete().eq('id', holidayId);
    if (error) throw error;

    return data;
};

export const updateHoliday = async (token: string, holidayId: string, updates: Partial<Holiday>) => {
    const supabase = await createClient(token);

    const { data, error } = await supabase
        .from('holidays')
        .update(updates)
        .eq('id', holidayId);
    if (error) throw error;

    return data;
};