import { createClient } from '@/utils/supabase';

export const getAllHolidays = async (token: string, userId: string) => {
    console.log('userId', userId);
    const supabase = await createClient(token);

    const { data, error } = await supabase.from('holidays').select('*').eq('user_id', userId);
    console.log('data', data);
    console.log('error', error);
    if (error) throw error;

    return data;
};

export const getHolidayById = async (token: string, holidayId: string) => {
    const supabase = await createClient(token);

    const [holidayData, criteriaData, accommodationsData] = await Promise.all([
        supabase.from('holidays').select('*').eq('id', holidayId),
        supabase.from('holiday_criteria').select('*').eq('holiday_id', holidayId),
        supabase.from('accommodations').select('*').eq('holiday_id', holidayId),
    ]);
    if (holidayData.error || criteriaData.error || accommodationsData.error) {
        throw {
            error: 'Cannot retrieve detail of holiday',
        };
    }
    return {
        holiday: holidayData.data,
        accommodations: accommodationsData.data,
        criteria: criteriaData.data,
    };
};

export const createHoliday = async (token: string, holiday: any) => {
    const supabase = await createClient(token);

    const { data, error } = await supabase.from('holidays').insert(holiday);
    if (error) throw error;

    return data;
};

export const deleteHoliday = async (token: string, holidayId: string) => {
    const supabase = await createClient(token);

    const { data, error } = await supabase.from('holidays').delete().eq('id', holidayId);
    if (error) throw error;

    return data;
};
