'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { Suspense } from 'react';
import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import z from 'zod';

import { usePathname } from 'next/navigation';

type InputProps = {
    label: string;
    name: string;
    error?: string;
    register: UseFormRegisterReturn;
};
const Input: React.FC<InputProps> = ({ label, name, error, register }) => {
    return (
        <div className='flex flex-col gap-y-2 w-128'>
            <label className='font-semibold' htmlFor={name}>
                {label}
            </label>
            <input type='password' {...register} className='px-2 py-1 rounded-lg border border-gray' />
            {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
        </div>
    );
};

type FormProps = {
    token: string;
};
const ResetForm: React.FC<FormProps> = ({ token }) => {
    const [success, setSuccess] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>();

    const formSchema = z.object({
        newPassword: z.string().min(8, 'The password must be at least 8 characters long.'),
        confirmNewPassword: z.string().min(8, 'The password must be at least 8 characters long.'),
    });
    type FormType = z.infer<typeof formSchema>;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    const onSubmit = async (data: FormType) => {
        if (data.newPassword !== data.confirmNewPassword) {
            setError('Both password need to be the same.');
            return;
        }

        const resp = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/reset-password/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        if (!resp.ok) {
            setError('An error occured while setting the new password');
            return;
        }

        reset();
        setSuccess(true);
    };

    /*
    const setSession = async () => {
        console.log('## Inside setSession ##');
        console.log('#SearchParams', searchParams.size, searchParams.keys().toArray().length);
        searchParams.forEach((sp) => {
            console.log('SearchParams::', sp);
        });
        searchParams.entries().forEach((sp) => {
            console.log('SearchParams::', sp[0], sp[1]);
        });
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (type === 'recovery' && token) {
            try {
                const { error } = await supabase.auth.verifyOtp({
                    token_hash: token,
                    type: 'recovery',
                });

                if (error) {
                    console.error('Error while setting session', error);
                    setCriticalError('Link for reinitializing the password is invalid or has expired.');
                }
            } catch (error) {
                console.error('Error:', error);
                setCriticalError('Error while validating the link.');
            }
        } else {
            // Si les paramètres ne sont pas présents
            console.log('type ? ', type);
            console.log('token?', token);
            searchParams.entries().map((sp) => console.log('SearchParams::', sp[0], sp[1]));
            setCriticalError('Link for reinitializing the password is invalid.');
        }
    };

    setSession();*/

    if (success) {
        return (
            <div className='flex flex-col items-center gap-y-6 w-1/2 mx-auto p-4'>
                <h1 className='text-3xl font-bold text-[#00897B]'>Holiday Selector</h1>
                <div className='p-4 rounded-lg border border-green-500 bg-green-500/10'>
                    <p className='text-green-600'>
                        Your password has been reset. You can now login in the app with your new password.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center gap-y-6 w-1/2 mx-auto p-4'>
            <h1 className='text-3xl font-bold text-[#00897B]'>Holiday Selector</h1>
            <h2 className='text-2xl font-semibold'>Reset Your Password</h2>

            {error ? (
                <div className='p-3 rounded-lg border border-red-500 bg-red-500/10'>
                    <p>{error}</p>
                </div>
            ) : null}

            <Input
                label='New Password'
                name='password'
                register={register('newPassword')}
                error={errors.newPassword?.message}
            />
            <Input
                label='Confirm New Password'
                name='confirmPassword'
                register={register('confirmNewPassword')}
                error={errors.confirmNewPassword?.message}
            />

            {isSubmitting ? (
                <p className='text-sm'>Resetting password ...</p>
            ) : (
                <button
                    className='p-2 rounded-lg bg-[#00897B] text-white w-128'
                    onClick={handleSubmit(onSubmit)}>
                    Reset
                </button>
            )}
        </div>
    );
};

export default function ResetPasswordPage() {
    React.useEffect(() => {
        console.log('useEffect ? ')
        // Get the access token and refresh token from the URL
        if (typeof window !== 'undefined') {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            console.log('access_token ? ', hashParams.get('access_token'));
            console.log('access_token ? ', hashParams.get('refresh_token'));
        }
    }, []);

    const params = { access_token: 'a', refresh_token: 'b' }

    /*
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('onAuth', event, session);
        if (event === 'PASSWORD_RECOVERY') {
            console.log('PASSWORD_RECOVERY', session);
        }
    });
    */

    /*
    if (params.error || !params.access_token) {
        return (
            <div className='flex flex-col items-center gap-y-6 w-1/2 mx-auto p-4'>
                <h1 className='text-3xl font-bold text-[#00897B]'>Holiday Selector</h1>
                <div className='p-4 rounded-lg border border-red-500 bg-red-500/10'>
                    <p className='text-red-600'>An error occured while validating your reset link.</p>
                </div>
            </div>
        );
    }*/

    const token = Array.isArray(params.access_token) ? params.access_token[0] : params.access_token;
    return (
        <Suspense>
            <ResetForm token={token} />
        </Suspense>
    );
}
