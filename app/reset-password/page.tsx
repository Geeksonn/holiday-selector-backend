'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import z from 'zod';

import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function ResetPasswordPage() {
    const [success, setSuccess] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>();
    const [criticalError, setCriticalError] = React.useState<string>();

    const searchParams = useSearchParams();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

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

        const { error } = await supabase.auth.updateUser({
            password: data.newPassword,
        });

        if (error) {
            console.error('Error while resetting the password', error);
            setError('Error while resetting the password');
        }

        reset();
        setSuccess(true);
    };

    React.useEffect(() => {
        const setSession = async () => {
            const accessToken = searchParams.get('access_token');
            const refreshToken = searchParams.get('refresh_token');
            const type = searchParams.get('type');

            if (type === 'recovery' && accessToken) {
                try {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || '',
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
                setCriticalError('Link for reinitializing the password is invalid.');
            }
        };

        setSession();
    }, [searchParams]);

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

    if (criticalError) {
        return (
            <div className='flex flex-col items-center gap-y-6 w-1/2 mx-auto p-4'>
                <h1 className='text-3xl font-bold text-[#00897B]'>Holiday Selector</h1>
                <div className='p-4 rounded-lg border border-red-500 bg-red-500/10'>
                    <p className='text-red-600'>{criticalError}</p>
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
}
