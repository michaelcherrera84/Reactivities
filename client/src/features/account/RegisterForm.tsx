import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAccount } from '../../lib/hooks/useAccount';
import { Box, Button, Paper, Typography } from '@mui/material';
import { LockOpen } from '@mui/icons-material';
import TextInput from '../../app/shared/components/TextInput';
import { Link } from 'react-router';
import { registerSchema, type RegisterSchema } from '../../lib/schemas/RegisterSchema';
import { useState } from 'react';
import RegisterSuccess from './RegisterSuccess';

export default function RegisterForm() {

    const { registerUser } = useAccount();
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const { control, handleSubmit, watch, setError, formState: { isValid, isSubmitting } } = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema),
    });

    const email = watch('email');

    const onSubmit = async (data: RegisterSchema) => {
        await registerUser.mutateAsync(data, {
            onSuccess: () => setRegisterSuccess(true),
            onError: (error) => {
                if (Array.isArray(error)) {
                    error.forEach(err => {
                        if (err.includes('Email')) setError('email', { message: err });
                        else if (err.includes('Password')) setError('password', { message: err });
                    });
                }
            },
        });
    };

    return (
        <>
            {registerSuccess ? (
                <RegisterSuccess email={email} />
            ) : (
                <Paper component="form"
                       onSubmit={handleSubmit(onSubmit)}
                       sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           p: 3,
                           gap: 3,
                           maxWidth: 'md',
                           mx: 'auto',
                           borderRadius: 3,
                       }}
                >
                    <Box display="flex" alignItems="center" justifyContent="center" gap={3} color="secondary.main">
                        <LockOpen fontSize="large" />
                        <Typography variant="h4">Register</Typography>
                    </Box>
                    <TextInput label="Email" control={control} name="email" />
                    <TextInput label="Display name" control={control} name="displayName" />
                    <TextInput label="Password" control={control} name="password" type="password" />
                    <Button type="submit" disabled={!isValid || isSubmitting} variant="contained" size="large">
                        Register
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        Already have an account?
                        <Typography component={Link} to="/login" color="primary" sx={{ ml: 2 }}>
                            Sign in
                        </Typography>
                    </Typography>
                </Paper>
            )}
            <p style={{ margin: '10px auto', maxWidth: '850px' }}>
                *Registering new users is currently unavailable. This application is for demonstration purposes only.
                While registering new users is technically possible, this application does not currently employ a
                registered domain for the email verification service.
            </p>
        </>
    );
}