import { createClient } from '@/utils/supabase';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        console.error(`Reset Password API didn't receive necessary params`);
        redirect('/reset-password?error=no_params');
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
    });

    if (error) {
        console.error(`Cannot validate params received`, token, error);
        redirect('/reset-password?error=invalid_params');
    }

    if (data.session) {
        const { access_token } = data.session;
        redirect(`/reset-password?access_token=${access_token}`);
    }

    redirect(`/reset-password?error=no_session_found`);
}

export async function POST(request: Request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return Response.json({ error: 'Missing Authorization header' }, { status: 401 });
    }
    const supabase = await createClient(token);

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
