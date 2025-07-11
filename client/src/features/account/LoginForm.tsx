import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '../../lib/schemas/loginSchema';
import { useForm } from 'react-hook-form';
import { useAccount } from '../../lib/hooks/useAccount';
import { Box, Button, Paper, Typography } from '@mui/material';
import { GitHub, LockOpen } from '@mui/icons-material';
import TextInput from '../../app/shared/components/TextInput';
import { Link, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function LoginForm() {

    const [notVerified, setNotVerified] = useState(false);
    const { loginUser, resendConfirmationEmail } = useAccount();
    const navigate = useNavigate();
    const location = useLocation();
    const { control, handleSubmit, watch, formState: { isValid, isSubmitting } } = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(loginSchema),
    });
    const email = watch('email');

    const handleResendEmail = async () => {
        try {
            await resendConfirmationEmail.mutateAsync({ email });
            setNotVerified(false);
        } catch (e) {
            toast.error('Problem sending email. Please check your email address.');
        }
    };

    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                navigate(location.state?.from || '/activities');
            },
            onError: error => {
                if (error.message === 'NotAllowed')
                    setNotVerified(true);
            },
        });
    };

    const loginWithGithub = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUrl = import.meta.env.VITE_REDIRECT_URL;
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=read:user user:email`;
    };

    return (
        <>
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
                    <Typography variant="h4">Sign In</Typography>
                </Box>
                <TextInput label="Email" control={control} name="email" />
                <TextInput label="Password" control={control} name="password" type="password" />
                <Button type="submit" disabled={!isValid || isSubmitting} variant="contained" size="large">
                    Login (use Email: bob@test.com, Password: Pa$$w0rd for testing)
                </Button>
                <Button onClick={loginWithGithub}
                        startIcon={<GitHub />}
                        sx={{ backgroundColor: 'black' }}
                        type="button"
                        variant="contained"
                        size="large"
                >
                    Login with Github
                </Button>
                {notVerified ? (
                    <Box display="flex" flexDirection="column" justifyContent="center">
                        <Typography textAlign="center" color="error">
                            Your email has not been verified. Click the button below to resend the verification email.
                        </Typography>
                        <Button disabled={resendConfirmationEmail.isPending} onClick={handleResendEmail}>
                            Resend verification email
                        </Button>
                    </Box>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
                        <Typography>
                            Forgot password? Click <Link to="/forgot-password">here</Link>
                        </Typography>
                        <Typography sx={{ textAlign: 'center' }}>
                            Don't have an account?
                            <Typography component={Link} to="/register" color="primary" sx={{ ml: 1 }}>
                                Sign up
                            </Typography>
                        </Typography>
                    </Box>
                )}
            </Paper>
            <p style={{ margin: '10px auto', maxWidth: '850px' }}>
                * Registering new users via email is currently unavailable. This application is for demonstration
                purposes only. While registering new users is technically possible, this application does not currently
                employ a registered domain for the email verification service.
            </p>
        </>
    );
}