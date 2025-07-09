import { createClient } from '@/utils/supabase';
import { createClient as createClientSupabase } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

type Params = {
    token: string;
    type: string;
};
export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const token = searchParams.get('token');

    if (!token || type !== 'recovery') {
        console.error(`Reset Password API didn't receive necessary params`, await params);
        redirect('/reset-password?error=no_params');
    }

    const supabase = await createClient(token);
    const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery',
    });

    if (error) {
        console.error(`Cannot validate params received`, token, type, error);
        redirect('/reset-password?error=invalid_params');
    }

    redirect(`/reset-password?token=${token}`);
}

export async function POST(request: Request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    //const supabase = await createClientSupabase(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const supabase = await createClient(token!);
    //supabase.auth.setSession()
    /*
    console.log('Token ? ', token);

    if (!token) {
        return Response.json({ error: 'Missing Authorization header' }, { status: 401 });
    }*/
    //const supabase = await createClient(token);

    const data = await request.json();

    const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
    });

    if (error) {
        console.error('Error while setting new password', error);
        return Response.json({ error: 'Cannot reset password' }, { status: 400 });
    }

    return Response.json({ message: 'ok' }, { status: 200 });
}
