import { useAccount } from '../../lib/hooks/useAccount';
import type { FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import AccountFormWrapper from './AccountFormWrapper';
import { LockOpen } from '@mui/icons-material';
import TextInput from '../../app/shared/components/TextInput';

export default function ForgotPasswordForm() {

    const { forgotPassword } = useAccount();
    const navigate = useNavigate();

    const onSubmit = async (data: FieldValues) => {
        try {
            await forgotPassword.mutateAsync(data.email, {
                onSuccess: () => {
                    toast.success('Password reset requested. Please check your email.');
                    navigate('/login');
                },
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <AccountFormWrapper title="Please enter your email address"
                            icon={<LockOpen fontSize="large" />}
                            onSubmit={onSubmit}
                            submitButtonText="Request password reset link"
        >
            <TextInput rules={{ required: true }} label="Email address" name="email" />
        </AccountFormWrapper>
    );
}